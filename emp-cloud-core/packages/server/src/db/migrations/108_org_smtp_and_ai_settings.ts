// =============================================================================
// MIGRATION 108 — Organization SMTP and AI Chatbot Settings
// Adds per-tenant SMTP server and AI provider/key configuration to organizations table.
// =============================================================================

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasSmtpHost = await knex.schema.hasColumn("organizations", "smtp_host");
  if (!hasSmtpHost) {
    await knex.schema.alterTable("organizations", (t) => {
      // Per-tenant SMTP Settings
      t.string("smtp_host", 255).nullable();
      t.integer("smtp_port").nullable().defaultTo(587);
      t.string("smtp_user", 255).nullable();
      t.text("smtp_pass").nullable();
      t.string("smtp_from_email", 255).nullable();
      t.string("smtp_from_name", 255).nullable();
      t.boolean("smtp_secure").notNullable().defaultTo(false);

      // Per-tenant AI Chatbot Settings
      t.string("ai_provider", 50).nullable().defaultTo("gemini");
      t.text("ai_api_key").nullable();
      t.string("ai_model", 100).nullable().defaultTo("gemini-1.5-flash");
      t.text("ai_system_prompt").nullable();
      t.boolean("ai_enabled").notNullable().defaultTo(true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasSmtpHost = await knex.schema.hasColumn("organizations", "smtp_host");
  if (hasSmtpHost) {
    await knex.schema.alterTable("organizations", (t) => {
      t.dropColumn("smtp_host");
      t.dropColumn("smtp_port");
      t.dropColumn("smtp_user");
      t.dropColumn("smtp_pass");
      t.dropColumn("smtp_from_email");
      t.dropColumn("smtp_from_name");
      t.dropColumn("smtp_secure");

      t.dropColumn("ai_provider");
      t.dropColumn("ai_api_key");
      t.dropColumn("ai_model");
      t.dropColumn("ai_system_prompt");
      t.dropColumn("ai_enabled");
    });
  }
}
