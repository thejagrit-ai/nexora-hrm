// =============================================================================
// MIGRATION 109 — Enterprise HRM Features
// Adds schemas for POSH, Statutory (PF/ESI/LWF/PT), Letters Generator, Delegations,
// Daily Work Reports, PMS KRAs/KPIs, Visitors, Webhooks, and Star Board.
// =============================================================================

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Statutory Configurations
  if (!(await knex.schema.hasTable("statutory_configs"))) {
    await knex.schema.createTable("statutory_configs", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("config_type", 50).notNullable(); // PF, ESI, LWF, PT
      t.string("title", 255).nullable();
      t.text("config_json").notNullable();
      t.boolean("is_active").notNullable().defaultTo(true);
      t.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }

  // 2. POSH Complaints & ICC Roster
  if (!(await knex.schema.hasTable("posh_complaints"))) {
    await knex.schema.createTable("posh_complaints", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("complaint_number", 50).nullable();
      t.integer("complainant_id").nullable();
      t.string("complainant_name", 255).notNullable();
      t.string("respondent_name", 255).notNullable();
      t.text("incident_description").notNullable();
      t.date("incident_date").nullable();
      t.string("location", 255).nullable();
      t.string("status", 50).notNullable().defaultTo("under_investigation");
      t.text("resolution_summary").nullable();
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable("posh_icc_members"))) {
    await knex.schema.createTable("posh_icc_members", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("member_name", 255).notNullable();
      t.string("designation", 255).nullable();
      t.string("role", 100).notNullable(); // Presiding Officer, Internal Member, External Member
      t.string("email", 255).nullable();
      t.string("phone", 50).nullable();
      t.boolean("is_external").notNullable().defaultTo(false);
    });
  }

  // 3. Approval Delegations
  if (!(await knex.schema.hasTable("approval_delegations"))) {
    await knex.schema.createTable("approval_delegations", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.integer("delegator_id").notNullable();
      t.integer("delegatee_id").notNullable();
      t.date("start_date").notNullable();
      t.date("end_date").notNullable();
      t.string("approval_type", 50).notNullable().defaultTo("all"); // leave, expense, attendance, all
      t.string("status", 20).notNullable().defaultTo("active");
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // 4. Letters Templates
  if (!(await knex.schema.hasTable("letters_templates"))) {
    await knex.schema.createTable("letters_templates", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("title", 255).notNullable();
      t.string("category", 50).notNullable(); // offer, experience, relieving, noc
      t.text("content_html").notNullable();
      t.string("header_logo", 255).nullable();
      t.string("footer_signature", 255).nullable();
      t.boolean("is_active").notNullable().defaultTo(true);
      t.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }

  // 5. Star Board (Employee Recognition)
  if (!(await knex.schema.hasTable("employee_star_board"))) {
    await knex.schema.createTable("employee_star_board", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.integer("giver_id").nullable();
      t.string("giver_name", 255).nullable();
      t.integer("receiver_id").nullable();
      t.string("receiver_name", 255).nullable();
      t.string("badge_type", 50).notNullable(); // team_player, innovator, star_performer, customer_champion
      t.string("badge_name", 100).nullable();
      t.string("title", 255).nullable();
      t.text("message").notNullable();
      t.integer("likes_count").notNullable().defaultTo(0);
      t.string("category", 50).nullable();
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // 6. Daily Work Reports & Tasks
  if (!(await knex.schema.hasTable("daily_work_reports"))) {
    await knex.schema.createTable("daily_work_reports", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.integer("user_id").notNullable();
      t.date("report_date").notNullable();
      t.text("tasks_completed").notNullable();
      t.text("blockers").nullable();
      t.decimal("hours_logged", 5, 2).notNullable().defaultTo(8.0);
      t.string("status", 50).notNullable().defaultTo("Submitted");
      t.text("manager_remarks").nullable();
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // 7. Webhook Subscriptions
  if (!(await knex.schema.hasTable("webhooks_subscriptions"))) {
    await knex.schema.createTable("webhooks_subscriptions", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("name", 255).nullable();
      t.string("target_url", 500).notNullable();
      t.string("secret_key", 255).notNullable();
      t.string("event_type", 100).notNullable();
      t.boolean("is_active").notNullable().defaultTo(true);
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // 8. Visitor Logs
  if (!(await knex.schema.hasTable("visitor_logs"))) {
    await knex.schema.createTable("visitor_logs", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("visitor_name", 255).notNullable();
      t.string("visitor_phone", 50).notNullable();
      t.string("visitor_email", 255).nullable();
      t.string("company_name", 255).nullable();
      t.string("host_name", 255).notNullable();
      t.integer("host_employee_id").nullable();
      t.string("purpose", 255).notNullable();
      t.string("pass_code", 50).notNullable();
      t.timestamp("check_in").nullable();
      t.timestamp("check_out").nullable();
      t.string("status", 50).notNullable().defaultTo("Checked In");
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  // 9. Performance KRAs/KPIs
  if (!(await knex.schema.hasTable("performance_kpis"))) {
    await knex.schema.createTable("performance_kpis", (t) => {
      t.increments("id").primary();
      t.integer("organization_id").notNullable();
      t.string("title", 255).notNullable();
      t.string("category", 100).notNullable();
      t.integer("target_score").notNullable().defaultTo(100);
      t.string("target_value", 100).nullable();
      t.integer("weightage").notNullable().defaultTo(0);
      t.text("description").nullable();
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("performance_kpis");
  await knex.schema.dropTableIfExists("visitor_logs");
  await knex.schema.dropTableIfExists("webhooks_subscriptions");
  await knex.schema.dropTableIfExists("daily_work_reports");
  await knex.schema.dropTableIfExists("employee_star_board");
  await knex.schema.dropTableIfExists("letters_templates");
  await knex.schema.dropTableIfExists("approval_delegations");
  await knex.schema.dropTableIfExists("posh_icc_members");
  await knex.schema.dropTableIfExists("posh_complaints");
  await knex.schema.dropTableIfExists("statutory_configs");
}

