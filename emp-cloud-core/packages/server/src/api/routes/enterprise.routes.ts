// =============================================================================
// EMP CLOUD — Enterprise Routes (POSH, Statutory, Delegations, Letters, Tasks, Visitor)
// =============================================================================

import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { getDB } from "../../db/connection.js";

const router = Router();

// --- POSH & ICC Routes ---

router.get("/posh/complaints", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const records = await db("posh_complaints").where({ organization_id: req.user!.org_id });
    sendSuccess(res, records);
  } catch (err) { next(err); }
});

router.post("/posh/complaints", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const [id] = await db("posh_complaints").insert({
      organization_id: req.user!.org_id,
      complainant_id: req.user!.id,
      complainant_name: `${req.user!.first_name || ""} ${req.user!.last_name || ""}`.trim() || "Anonymous",
      respondent_name: req.body.respondent_name || "Unknown",
      incident_description: req.body.incident_description || "",
      status: "under_investigation",
      incident_date: req.body.incident_date || new Date(),
    });
    const created = await db("posh_complaints").where({ id }).first();
    sendSuccess(res, created, 201);
  } catch (err) { next(err); }
});

router.get("/posh/icc", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const members = await db("posh_icc_members").where({ organization_id: req.user!.org_id });
    sendSuccess(res, members);
  } catch (err) { next(err); }
});

// --- Statutory Compliance Routes (PF / ESI / LWF / PT) ---

router.get("/statutory", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const configs = await db("statutory_configs").where({ organization_id: req.user!.org_id });
    sendSuccess(res, configs);
  } catch (err) { next(err); }
});

router.post("/statutory", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const { config_type, config_json } = req.body;
    await db("statutory_configs").insert({
      organization_id: req.user!.org_id,
      config_type,
      config_json: JSON.stringify(config_json || {}),
    });
    sendSuccess(res, { message: "Statutory configuration saved" }, 201);
  } catch (err) { next(err); }
});

// --- Approval Delegations ---

router.get("/delegations", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const list = await db("approval_delegations").where({ organization_id: req.user!.org_id });
    sendSuccess(res, list);
  } catch (err) { next(err); }
});

router.post("/delegations", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const [id] = await db("approval_delegations").insert({
      organization_id: req.user!.org_id,
      delegator_id: req.user!.id,
      delegatee_id: req.body.delegatee_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      approval_type: req.body.approval_type || "all",
      status: "active",
    });
    const item = await db("approval_delegations").where({ id }).first();
    sendSuccess(res, item, 201);
  } catch (err) { next(err); }
});

// --- Letters & Certificates ---

router.get("/letters/templates", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const templates = await db("letters_templates").where({ organization_id: req.user!.org_id });
    sendSuccess(res, templates);
  } catch (err) { next(err); }
});

// --- Star Board ---

router.get("/star-board", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const stars = await db("employee_star_board").where({ organization_id: req.user!.org_id });
    sendSuccess(res, stars);
  } catch (err) { next(err); }
});

router.post("/star-board", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const [id] = await db("employee_star_board").insert({
      organization_id: req.user!.org_id,
      giver_id: req.user!.id,
      receiver_id: req.body.receiver_id,
      badge_type: req.body.badge_type || "star_performer",
      message: req.body.message || "Great job!",
    });
    const item = await db("employee_star_board").where({ id }).first();
    sendSuccess(res, item, 201);
  } catch (err) { next(err); }
});

// --- Daily Work Reports ---

router.get("/tasks/reports", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const reports = await db("daily_work_reports").where({ organization_id: req.user!.org_id });
    sendSuccess(res, reports);
  } catch (err) { next(err); }
});

router.post("/tasks/reports", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const [id] = await db("daily_work_reports").insert({
      organization_id: req.user!.org_id,
      user_id: req.user!.id,
      report_date: req.body.report_date || new Date(),
      tasks_completed: req.body.tasks_completed || "",
      blockers: req.body.blockers || "",
      hours_logged: req.body.hours_logged || 8,
    });
    const created = await db("daily_work_reports").where({ id }).first();
    sendSuccess(res, created, 201);
  } catch (err) { next(err); }
});

// --- Visitor Logs ---

router.get("/visitors", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const logs = await db("visitor_logs").where({ organization_id: req.user!.org_id });
    sendSuccess(res, logs);
  } catch (err) { next(err); }
});

router.post("/visitors", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const passCode = `VIS-${Math.floor(100000 + Math.random() * 900000)}`;
    const [id] = await db("visitor_logs").insert({
      organization_id: req.user!.org_id,
      visitor_name: req.body.visitor_name,
      visitor_phone: req.body.visitor_phone,
      host_name: req.body.host_name,
      purpose: req.body.purpose,
      pass_code: passCode,
    });
    const item = await db("visitor_logs").where({ id }).first();
    sendSuccess(res, item, 201);
  } catch (err) { next(err); }
});

// --- Webhooks ---

router.get("/webhooks", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDB();
    const hooks = await db("webhooks_subscriptions").where({ organization_id: req.user!.org_id });
    sendSuccess(res, hooks);
  } catch (err) { next(err); }
});

export default router;
