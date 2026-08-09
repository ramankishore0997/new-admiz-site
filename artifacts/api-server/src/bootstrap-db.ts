import { pool } from "@workspace/db";
import { hashPassword } from "./lib/crypto";

/**
 * Idempotent database bootstrap for fresh deployments (Railway/Docker).
 * - Creates all 12 tables (CREATE TABLE IF NOT EXISTS) matching the drizzle schema.
 * - Seeds a SUPER_ADMIN account from ADMIN_EMAIL / ADMIN_PASSWORD env vars
 *   ONLY when the users table is empty (first boot).
 */

const TABLES: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    username text,
    company_name text,
    telegram_handle text,
    phone_number text,
    country text,
    refer_code text,
    role text NOT NULL DEFAULT 'CLIENT',
    status text NOT NULL DEFAULT 'ACTIVE',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS refer_code text`,
  `CREATE TABLE IF NOT EXISTS password_change_requests (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    new_password_hash text NOT NULL,
    source text NOT NULL,
    status text NOT NULL DEFAULT 'PENDING',
    requested_at timestamp NOT NULL DEFAULT now(),
    processed_at timestamp
  )`,
  `CREATE TABLE IF NOT EXISTS applications (
    id serial PRIMARY KEY,
    public_id text NOT NULL UNIQUE,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'DRAFT',
    personal_info jsonb,
    business_info jsonb,
    advertising_info jsonb,
    account_requirements jsonb,
    rejection_reason text,
    assigned_admin_id integer REFERENCES users(id),
    submitted_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS application_timeline (
    id serial PRIMARY KEY,
    application_id integer NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event text NOT NULL,
    description text,
    actor_id integer REFERENCES users(id),
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS application_messages (
    id serial PRIMARY KEY,
    application_id integer NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    sender_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message text NOT NULL,
    attachments jsonb,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS documents (
    id serial PRIMARY KEY,
    application_id integer NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    uploader_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category text NOT NULL,
    file_name text NOT NULL,
    file_key text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    status text NOT NULL DEFAULT 'PENDING_REVIEW',
    rejection_reason text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS accounts (
    id serial PRIMARY KEY,
    application_id integer NOT NULL REFERENCES applications(id),
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform text NOT NULL,
    account_id text,
    business_portfolio_id text,
    spend_limit text,
    status text NOT NULL DEFAULT 'PENDING_PROVISIONING',
    balance text NOT NULL DEFAULT '0',
    notes text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE accounts ADD COLUMN IF NOT EXISTS balance text NOT NULL DEFAULT '0'`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS support_tickets (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject text NOT NULL,
    category text NOT NULL,
    priority text NOT NULL,
    status text NOT NULL DEFAULT 'OPEN',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS support_messages (
    id serial PRIMARY KEY,
    ticket_id integer NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message text NOT NULL,
    attachments jsonb,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id serial PRIMARY KEY,
    actor_id integer REFERENCES users(id) ON DELETE SET NULL,
    action text NOT NULL,
    target_type text,
    target_id integer,
    ip_address text,
    metadata jsonb,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS payments (
    id serial PRIMARY KEY,
    order_id text NOT NULL UNIQUE,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount text NOT NULL,
    currency text NOT NULL DEFAULT 'USDT',
    network text NOT NULL,
    receiving_address text NOT NULL DEFAULT '0x5e094e9Fc46FF77D638682CcB50b6D3b6BFbd2d0',
    tx_hash text NOT NULL,
    screenshot_url text NOT NULL,
    note text,
    status text NOT NULL DEFAULT 'PENDING_VERIFICATION',
    rejection_reason text,
    verified_by integer REFERENCES users(id),
    verified_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS application_fees (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id integer NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    amount text NOT NULL,
    description text,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS account_loads (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id integer NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount text NOT NULL,
    commission text NOT NULL,
    total text NOT NULL,
    description text,
    loaded_by integer REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS telegram_admin_actions (
    id serial PRIMARY KEY,
    chat_id text NOT NULL,
    action text NOT NULL,
    entity_type text,
    entity_id integer,
    result text NOT NULL DEFAULT 'SUCCESS',
    reason text,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS telegram_notification_events (
    id serial PRIMARY KEY,
    event text NOT NULL,
    payload jsonb,
    success boolean NOT NULL DEFAULT true,
    error text,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
];

async function main() {
  console.log("[bootstrap] Connecting to database...");
  const client = await pool.connect();
  try {
    for (const sql of TABLES) {
      await client.query(sql);
    }
    console.log(`[bootstrap] ${TABLES.length} tables ensured.`);

    const { rows } = await client.query<{ n: number }>("SELECT COUNT(*)::int AS n FROM users");
    if (rows[0]?.n === 0) {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      if (email && password) {
        await client.query(
          `INSERT INTO users (email, password, username, company_name, role, status)
           VALUES ($1, $2, $3, 'Railway Operations', 'SUPER_ADMIN', 'ACTIVE')
           ON CONFLICT (email) DO NOTHING`,
          [email.toLowerCase().trim(), hashPassword(password), process.env.ADMIN_USERNAME || "admin"],
        );
        console.log(`[bootstrap] Seeded SUPER_ADMIN: ${email.toLowerCase().trim()}`);
      } else {
        console.warn("[bootstrap] Users table is empty and ADMIN_EMAIL/ADMIN_PASSWORD are not set — no admin seeded.");
      }
    } else {
      console.log(`[bootstrap] ${rows[0]?.n} existing users found — skipping admin seed.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main()
  .then(() => {
    console.log("[bootstrap] Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[bootstrap] FAILED:", err?.message || err);
    process.exit(1);
  });
