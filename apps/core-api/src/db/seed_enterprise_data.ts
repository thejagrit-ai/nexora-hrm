import { initDB, closeDB, getDB } from "./connection.js";
import { runAllMigrations } from "./run-migrations.js";
import { logger } from "../utils/logger.js";

export async function seedEnterpriseData() {
  await initDB();
  const db = getDB();

  logger.info("Running database migrations before seeding...");
  await runAllMigrations(db);

  logger.info("Seeding Enterprise HRM data...");

  // Find or create default organization
  let org = await db("organizations").first();
  let orgId = org?.id;

  if (!orgId) {
    const [insertedId] = await db("organizations").insert({
      name: "TechNova Solutions Pvt. Ltd.",
      legal_name: "TechNova Solutions Private Limited",
      email: "admin@technova.in",
      contact_number: "+91-9876543210",
      website: "https://technova.in",
      timezone: "Asia/Kolkata",
      country: "IN",
      state: "Karnataka",
      city: "Bengaluru",
      language: "en",
      current_user_count: 15,
      total_allowed_user_count: 500,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    orgId = insertedId;
  }

  // 1. Seed Locations
  const locations = [
    { name: "Bengaluru HQ", city: "Bengaluru", state: "Karnataka", country: "IN", is_primary: 1 },
    { name: "Mumbai Regional Office", city: "Mumbai", state: "Maharashtra", country: "IN", is_primary: 0 },
    { name: "Delhi NCR Branch", city: "Gurugram", state: "Haryana", country: "IN", is_primary: 0 },
  ];
  const locationIds: number[] = [];
  for (const loc of locations) {
    let existing = await db("organization_locations").where({ organization_id: orgId, name: loc.name }).first();
    if (existing) {
      locationIds.push(existing.id);
    } else {
      const [id] = await db("organization_locations").insert({
        organization_id: orgId,
        name: loc.name,
        address: `${loc.name}, Tech Park, ${loc.city}`,
        timezone: "Asia/Kolkata",
        created_at: new Date(),
        updated_at: new Date(),
      });
      locationIds.push(id);
    }
  }

  // 2. Seed Departments
  const deptNames = ["Engineering", "Product & Design", "Human Resources", "Finance & Accounts", "Sales & Marketing", "Customer Success"];
  const deptIds: number[] = [];
  for (const name of deptNames) {
    let existing = await db("organization_departments").where({ organization_id: orgId, name }).first();
    if (existing) {
      deptIds.push(existing.id);
    } else {
      const [id] = await db("organization_departments").insert({
        organization_id: orgId,
        name,
        created_at: new Date(),
        updated_at: new Date(),
      });
      deptIds.push(id);
    }
  }

  // 3. Seed POSH & ICC
  let iccCount = await db("posh_icc_members").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(iccCount?.count || 0) === 0) {
    await db("posh_icc_members").insert([
      { organization_id: orgId, member_name: "Ananya Gupta", designation: "HR Director & Presiding Officer", email: "ananya@technova.in", phone: "+91-9876543210", role: "Presiding Officer", is_external: false },
      { organization_id: orgId, member_name: "Meera Krishnan", designation: "Senior HR Lead", email: "meera@technova.in", phone: "+91-9876543211", role: "Internal Member", is_external: false },
      { organization_id: orgId, member_name: "Adv. Sunita Rao", designation: "High Court Advocate", email: "sunita.law@ngo.org", phone: "+91-9876543299", role: "External Member", is_external: true },
    ]);

    await db("posh_complaints").insert([
      { organization_id: orgId, complaint_number: "POSH-2026-001", complainant_name: "Anonymous Employee", respondent_name: "Rohan Verma", incident_description: "Inappropriate communication during project team dinner.", incident_date: "2026-08-10", location: "Bengaluru HQ - Floor 3", status: "under_investigation", resolution_summary: null, created_at: new Date() },
      { organization_id: orgId, complaint_number: "POSH-2026-002", complainant_name: "Employee #TN-009", respondent_name: "Karan Johar", incident_description: "Unwanted repetitive messages outside work hours.", incident_date: "2026-06-14", location: "Remote Slack Workspace", status: "resolved", resolution_summary: "Respondent issued formal written warning and mandatory sensitivity training completed.", created_at: new Date() },
    ]);
  }

  // 4. Seed Statutory Payroll Config
  let statCount = await db("statutory_configs").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(statCount?.count || 0) === 0) {
    await db("statutory_configs").insert([
      { organization_id: orgId, config_type: "PF", title: "Provident Fund (EPF)", config_json: JSON.stringify({ pf_number: "KN/BNG/1293849/000", employee_pct: 12, employer_pct: 12, ceiling: 15000 }), is_active: true, updated_at: new Date() },
      { organization_id: orgId, config_type: "ESI", title: "Employee State Insurance (ESIC)", config_json: JSON.stringify({ esi_number: "31000987650000101", employee_pct: 0.75, employer_pct: 3.25, ceiling: 21000 }), is_active: true, updated_at: new Date() },
      { organization_id: orgId, config_type: "LWF", title: "Labour Welfare Fund (Karnataka)", config_json: JSON.stringify({ employee_contrib: 20, employer_contrib: 40 }), is_active: true, updated_at: new Date() },
      { organization_id: orgId, config_type: "PT", title: "Professional Tax (Karnataka)", config_json: JSON.stringify({ slab_rates: "Rs 200/mo for salary > Rs 25,000" }), is_active: true, updated_at: new Date() },
    ]);
  }

  // 5. Seed Letters & Templates
  let letterCount = await db("letters_templates").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(letterCount?.count || 0) === 0) {
    await db("letters_templates").insert([
      { organization_id: orgId, title: "Standard Experience Certificate", category: "experience", content_html: "<p>This is to certify that <strong>{{employee_name}}</strong> was employed with TechNova Solutions as <strong>{{designation}}</strong> from {{date_of_joining}} to {{date_of_exit}}. During their tenure, we found them dedicated and professional.</p>", header_logo: "logo.png", footer_signature: "HR Director", is_active: true, updated_at: new Date() },
      { organization_id: orgId, title: "Relieving Cum Service Letter", category: "relieving", content_html: "<p>We hereby accept the resignation of <strong>{{employee_name}}</strong> ({{emp_code}}). They are relieved from their duties as {{designation}} with effect from {{date_of_exit}}.</p>", header_logo: "logo.png", footer_signature: "HR Director", is_active: true, updated_at: new Date() },
      { organization_id: orgId, title: "Standard Employment Offer Letter", category: "offer", content_html: "<p>Dear {{employee_name}},<br><br>We are pleased to offer you the position of <strong>{{designation}}</strong> at TechNova Solutions with an annual CTC of {{annual_ctc}}. Your joining date is {{date_of_joining}}.</p>", header_logo: "logo.png", footer_signature: "VP Human Resources", is_active: true, updated_at: new Date() },
    ]);
  }

  // 6. Seed Daily Work Reports
  let reportCount = await db("daily_work_reports").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(reportCount?.count || 0) === 0) {
    await db("daily_work_reports").insert([
      { organization_id: orgId, user_id: 1, report_date: "2026-09-18", tasks_completed: "Completed enterprise HRM migration endpoints and statutory payroll config UI.", hours_logged: 8.5, blockers: "None", status: "Approved", manager_remarks: "Great work!", created_at: new Date() },
      { organization_id: orgId, user_id: 2, report_date: "2026-09-18", tasks_completed: "Configured multi-tenant AI provider key management UI & SMTP server test connections.", hours_logged: 8.0, blockers: "Waiting on sandbox API key verification.", status: "Approved", manager_remarks: "Approved", created_at: new Date() },
      { organization_id: orgId, user_id: 3, report_date: "2026-09-19", tasks_completed: "Updated sidebar design and responsive full-screen modal backdrop blurs.", hours_logged: 7.5, blockers: "None", status: "Submitted", created_at: new Date() },
    ]);
  }

  // 7. Seed Performance KPIs
  let kpiCount = await db("performance_kpis").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(kpiCount?.count || 0) === 0) {
    await db("performance_kpis").insert([
      { organization_id: orgId, title: "On-Time Sprint Delivery", category: "Engineering Excellence", target_score: 95, target_value: "95%", weightage: 30, description: "Deliver 95% of committed user stories within the 2-week sprint cycle.", created_at: new Date() },
      { organization_id: orgId, title: "Code Coverage & Quality", category: "Technical Standards", target_score: 85, target_value: ">85%", weightage: 25, description: "Maintain unit test code coverage above 85% with zero high severity security alerts.", created_at: new Date() },
      { organization_id: orgId, title: "Client NPS & Satisfaction", category: "Customer Success", target_score: 90, target_value: "9.0 / 10", weightage: 20, description: "Achieve client satisfaction score above 9.0 on quarter-end survey.", created_at: new Date() },
    ]);
  }

  // 8. Seed Visitor Logs
  let visitorCount = await db("visitor_logs").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(visitorCount?.count || 0) === 0) {
    await db("visitor_logs").insert([
      { organization_id: orgId, visitor_name: "Suresh Menon", visitor_phone: "+91-9988776655", visitor_email: "suresh@acmepartners.com", company_name: "ACME Corp", host_name: "Ananya Gupta", host_employee_id: 1, purpose: "Vendor Partnership Discussion", pass_code: "VIS-901", check_in: new Date("2026-09-20T10:30:00"), check_out: new Date("2026-09-20T12:00:00"), status: "Checked Out", created_at: new Date() },
      { organization_id: orgId, visitor_name: "Kavita Sharma", visitor_phone: "+91-9911223344", visitor_email: "kavita@talentsearch.com", company_name: "TalentSearch Executive", host_name: "Vikram Reddy", host_employee_id: 2, purpose: "Leadership Recruitment Meeting", pass_code: "VIS-902", check_in: new Date("2026-09-20T14:15:00"), status: "Checked In", created_at: new Date() },
    ]);
  }

  // 9. Seed Webhook Endpoints
  let whCount = await db("webhooks_subscriptions").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(whCount?.count || 0) === 0) {
    await db("webhooks_subscriptions").insert([
      { organization_id: orgId, name: "Real-time Attendance Stream", target_url: "https://api.technova.in/hooks/attendance", secret_key: "whsec_live_9812739182371928", event_type: "attendance.marked", is_active: true, created_at: new Date() },
      { organization_id: orgId, name: "Employee Onboard Trigger", target_url: "https://hooks.zapier.com/hooks/catch/90123/abc", secret_key: "whsec_live_1239012389102389", event_type: "employee.onboarded", is_active: true, created_at: new Date() },
    ]);
  }

  // 10. Seed Star Board Recognition
  let starCount = await db("employee_star_board").where({ organization_id: orgId }).count({ count: "*" }).first();
  if (Number(starCount?.count || 0) === 0) {
    await db("employee_star_board").insert([
      { organization_id: orgId, giver_id: 1, giver_name: "Ananya Gupta", receiver_id: 2, receiver_name: "Rahul Sharma", badge_type: "star_performer", badge_name: "Employee of the Month", title: "Outstanding HRM Platform Delivery", message: "Successfully delivered the complete multi-tenant Enterprise HRM suite with zero defects!", likes_count: 32, category: "Excellence", created_at: new Date() },
      { organization_id: orgId, giver_id: 3, giver_name: "Vikram Reddy", receiver_id: 4, receiver_name: "Priya Patel", badge_type: "innovator", badge_name: "Innovation Champion", title: "Custom Dropdown & UI Polish", message: "Designed the high-performance CustomSelect and date picker components across all screens.", likes_count: 24, category: "Innovation", created_at: new Date() },
    ]);
  }

  logger.info("Successfully seeded all Enterprise HRM features with realistic data!");
  await closeDB();
}

// Allow standalone execution
if (process.argv[1]?.includes("seed_enterprise_data")) {
  seedEnterpriseData().catch((err) => {
    logger.error("Seeding failed", err);
    process.exit(1);
  });
}
