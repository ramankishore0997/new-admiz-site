import { db, accountsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * Provision an APPROVED ad account for an approved application.
 * The account is not ACTIVE yet: the client must top up the minimum amount
 * first, after which an admin assigns Business Manager access (ACTIVE).
 * The client-chosen name, BM ID / Gmail are carried over from the application.
 */
export async function provisionAdAccount(app: {
  id: number;
  userId: number;
  advertisingInfo: Record<string, unknown> | null;
  accountRequirements: Record<string, unknown> | null;
}) {
  const platform = String(app.advertisingInfo?.platform || "Other Ads Platform");
  const reqs = app.accountRequirements || {};
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  const [acc] = await db
    .insert(accountsTable)
    .values({
      applicationId: app.id,
      userId: app.userId,
      platform,
      accountId: `ACC-${stamp}${random}`,
      businessPortfolioId: String(reqs.businessManagerId || reqs.gmail || "").trim() || null,
      name: String(reqs.accountName || "").trim() || null,
      spendLimit: "Starter",
      status: "APPROVED",
    })
    .returning();

  return acc;
}

/** Returns true when this application already has a provisioned account. */
export async function hasProvisionedAccount(applicationId: number): Promise<boolean> {
  const rows = await db
    .select({ id: accountsTable.id })
    .from(accountsTable)
    .where(eq(accountsTable.applicationId, applicationId))
    .limit(1);
  return rows.length > 0;
}
