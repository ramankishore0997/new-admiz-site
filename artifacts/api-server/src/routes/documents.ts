import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { db, documentsTable, applicationsTable, applicationTimelineTable, type Document } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

// Create uploads directory outside the public web root
const UPLOAD_DIR = path.resolve(import.meta.dirname, "../../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIMES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

/**
 * List uploaded documents for the client
 */
router.get("/documents", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const docs = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.uploaderId, userId))
      .orderBy(documentsTable.id);

    return res.json(docs);
  } catch (err) {
    return next(err);
  }
});

/**
 * Upload a document via Base64 payload
 */
router.post("/documents", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const { applicationId, category, fileName, mimeType, base64Data } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!applicationId || !category || !fileName || !mimeType || !base64Data) {
      return res.status(400).json({ error: "Missing required upload parameters." });
    }

    // Verify application ownership and status
    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, Number(applicationId)), eq(applicationsTable.userId, userId)))
      .limit(1);

    if (!app) {
      return res.status(404).json({ error: "Associated application not found." });
    }

    // Parse base64 content
    const base64Body = base64Data.split(";base64,").pop();
    if (!base64Body) {
      return res.status(400).json({ error: "Invalid base64 document format." });
    }
    const buffer = Buffer.from(base64Body, "base64");

    // Validations
    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File exceeds max allowed size of 10MB." });
    }
    if (!ALLOWED_MIMES.includes(mimeType)) {
      return res.status(400).json({ error: "Unsupported file format. Only PDF, PNG, JPG, and JPEG are allowed." });
    }

    // Secure randomized filename
    const ext = path.extname(fileName) || (mimeType === "application/pdf" ? ".pdf" : ".png");
    const fileKey = `doc_${crypto.randomUUID()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileKey);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Insert metadata
    const [newDoc] = await db
      .insert(documentsTable)
      .values({
        applicationId: app.id,
        uploaderId: userId,
        category,
        fileName,
        fileKey,
        fileSize: buffer.length,
        mimeType,
        status: "PENDING_REVIEW",
      })
      .returning();

    // Log timeline event
    await db.insert(applicationTimelineTable).values({
      applicationId: app.id,
      event: "Document Uploaded",
      description: `Uploaded ${category} document: ${fileName}`,
      actorId: userId,
    });

    return res.status(201).json(newDoc);
  } catch (err) {
    return next(err);
  }
});

/**
 * Replace a rejected document
 */
router.post("/documents/:id/replace", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const docId = Number(req.params.id);
    const { base64Data, fileName, mimeType } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!base64Data || !fileName || !mimeType) {
      return res.status(400).json({ error: "Missing file payload parameters." });
    }

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(and(eq(documentsTable.id, docId), eq(documentsTable.uploaderId, userId)))
      .limit(1);

    if (!doc) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Parse base64 content
    const base64Body = base64Data.split(";base64,").pop();
    if (!base64Body) {
      return res.status(400).json({ error: "Invalid base64 payload." });
    }
    const buffer = Buffer.from(base64Body, "base64");

    // Validations
    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File exceeds max allowed size of 10MB." });
    }
    if (!ALLOWED_MIMES.includes(mimeType)) {
      return res.status(400).json({ error: "Unsupported file format." });
    }

    // Secure randomized filename
    const ext = path.extname(fileName) || (mimeType === "application/pdf" ? ".pdf" : ".png");
    const fileKey = `doc_${crypto.randomUUID()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileKey);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Update metadata
    const [updatedDoc] = await db
      .update(documentsTable)
      .set({
        fileName,
        fileKey,
        fileSize: buffer.length,
        mimeType,
        status: "PENDING_REVIEW",
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(documentsTable.id, docId))
      .returning();

    // Log timeline event
    await db.insert(applicationTimelineTable).values({
      applicationId: doc.applicationId,
      event: "Document Replaced",
      description: `Replaced ${doc.category} document with: ${fileName}`,
      actorId: userId,
    });

    return res.json(updatedDoc);
  } catch (err) {
    return next(err);
  }
});

/**
 * Securely Download/View document
 */
router.get("/documents/:id/download", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role || "CLIENT";
    const docId = Number(req.params.id);

    if (Number.isNaN(docId)) {
      return res.status(400).json({ error: "Invalid ID." });
    }

    const [doc] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, docId))
      .limit(1);

    if (!doc) {
      return res.status(404).json({ error: "Document not found." });
    }

    // Access control: client can only download their own documents; admins can access any
    const isAdmin = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(userRole);
    if (!isAdmin && doc.uploaderId !== userId) {
      return res.status(403).json({ error: "Forbidden: Access denied." });
    }

    const filePath = path.join(UPLOAD_DIR, doc.fileKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Physical document file is missing from storage." });
    }

    // Set appropriate content disposition headers
    res.setHeader("Content-Disposition", `inline; filename="${doc.fileName}"`);
    res.setHeader("Content-Type", doc.mimeType);
    return res.sendFile(filePath);
  } catch (err) {
    return next(err);
  }
});

export default router;
