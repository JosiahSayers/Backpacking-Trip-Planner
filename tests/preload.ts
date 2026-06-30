import { db } from "$/utils/db";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, afterEach, beforeAll } from "bun:test";

GlobalRegistrator.register();

// Imported after register() so @testing-library/react sees a live DOM on init,
// and its internal beforeAll() runs at module load time (not inside a test).
const { cleanup } = await import("@testing-library/react");

// Auth tables are left untouched between tests. Login sessions are created in
// each suite's beforeAll (after the snapshot is taken), so resetting them would
// invalidate the cookies every test relies on.
const AUTH_TABLES = ["user", "session", "account", "verification"];

// Tables we snapshot after seeding and restore between tests. Captured in
// beforeAll so we don't re-query the catalog on every reset.
let domainTables: string[] = [];

async function getDomainTables() {
  const rows = await db.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations'
      AND tablename NOT LIKE '__snap__%'
  `;
  return rows.map((r) => r.tablename).filter((t) => !AUTH_TABLES.includes(t));
}

if (!process.env.SKIP_DB_SETUP) {
  beforeAll(async () => {
    await Bun.$`bunx --bun prisma migrate reset --force`;
    await Bun.$`bun db:seed`;

    // Snapshot the seeded baseline. Each table is copied verbatim (ids and all)
    // so restoring puts every seeded/migration row back exactly where it was.
    domainTables = await getDomainTables();
    for (const table of domainTables) {
      await db.$executeRawUnsafe(`DROP TABLE IF EXISTS "__snap__${table}"`);
      await db.$executeRawUnsafe(
        `CREATE TABLE "__snap__${table}" AS TABLE "${table}"`,
      );
    }
  });

  // Drop the snapshot tables so they don't linger in the dev database.
  afterAll(async () => {
    for (const table of domainTables) {
      await db.$executeRawUnsafe(`DROP TABLE IF EXISTS "__snap__${table}"`);
    }
  });

  // Reset the database to the seeded baseline after every test. We truncate and
  // re-insert from the snapshot inside a single interactive transaction so the
  // `SET LOCAL session_replication_role` (which disables FK/trigger checks, so
  // insertion order doesn't matter) is pinned to one pooled connection. We do
  // NOT restart identity sequences: they only ever climb, so app-created rows
  // keep getting fresh ids that never collide with the restored baseline rows.
  afterEach(async () => {
    if (domainTables.length === 0) return;

    const quoted = domainTables.map((t) => `"${t}"`).join(", ");
    await db.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL session_replication_role = 'replica'`,
      );
      await tx.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} CASCADE`);
      for (const table of domainTables) {
        await tx.$executeRawUnsafe(
          `INSERT INTO "${table}" SELECT * FROM "__snap__${table}"`,
        );
      }
    });
  });
}

afterEach(() => {
  cleanup();
});
