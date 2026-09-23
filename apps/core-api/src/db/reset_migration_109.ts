import { initDB, closeDB, getDB } from "./connection.js";
import { down } from "./migrations/109_enterprise_hrm_features.js";

async function main() {
  await initDB();
  const db = getDB();
  console.log("Dropping migration 109 tables...");
  await down(db);
  console.log("Removing migration 109 from _migration_state...");
  await db("_migration_state").where({ key: "109_enterprise_hrm_features" }).delete();
  console.log("Migration 109 state successfully reset!");
  await closeDB();
}

main().catch(console.error);
