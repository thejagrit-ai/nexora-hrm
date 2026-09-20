import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import { usePermissions } from "@/lib/use-permissions";

const EmployeeDirectoryPage = lazy(() => import("@/pages/employees/EmployeeDirectoryPage"));
const EmployeeProfilePage = lazy(() => import("@/pages/employees/EmployeeProfilePage"));
const OrgChartPage = lazy(() => import("@/pages/employees/OrgChartPage"));
const ImportEmployeesPage = lazy(() => import("@/pages/employees/ImportEmployeesPage"));
const AttendanceDashboardPage = lazy(() => import("@/pages/attendance/AttendanceDashboardPage"));
const AttendancePage = lazy(() => import("@/pages/attendance/AttendancePage"));
const ShiftsPage = lazy(() => import("@/pages/attendance/ShiftsPage"));
const ShiftSchedulePage = lazy(() => import("@/pages/attendance/ShiftSchedulePage"));
const RegularizationsPage = lazy(() => import("@/pages/attendance/RegularizationsPage"));
const AttendanceSettingsPage = lazy(() => import("@/pages/attendance/AttendanceSettingsPage"));
const AttendanceGridPage = lazy(() => import("@/pages/attendance/AttendanceGridPage"));
const LeaveDashboardPage = lazy(() => import("@/pages/leave/LeaveDashboardPage"));
const LeaveApplicationsPage = lazy(() => import("@/pages/leave/LeaveApplicationsPage"));
const LeaveCalendarPage = lazy(() => import("@/pages/leave/LeaveCalendarPage"));
const LeaveTypesPage = lazy(() => import("@/pages/leave/LeaveTypesPage"));
const CompOffPage = lazy(() => import("@/pages/leave/CompOffPage"));
const HolidaysPage = lazy(() => import("@/pages/events/HolidaysPage"));
const DocumentsPage = lazy(() => import("@/pages/documents/DocumentsPage"));
const DocumentCategoriesPage = lazy(() => import("@/pages/documents/DocumentCategoriesPage"));
const MyDocumentsPage = lazy(() => import("@/pages/documents/MyDocumentsPage"));
const AnnouncementsPage = lazy(() => import("@/pages/announcements/AnnouncementsPage"));
const PoliciesPage = lazy(() => import("@/pages/policies/PoliciesPage"));
const ProbationPage = lazy(() => import("@/pages/employees/ProbationPage"));

// Enterprise Missing Features
const PoshPage = lazy(() => import("@/pages/compliance/PoshPage"));
const StatutoryConfigPage = lazy(() => import("@/pages/payroll/StatutoryConfigPage"));
const LettersGeneratorPage = lazy(() => import("@/pages/documents/LettersGeneratorPage"));
const DelegationsPage = lazy(() => import("@/pages/workflow/DelegationsPage"));
const DailyWorkReportPage = lazy(() => import("@/pages/tasks/DailyWorkReportPage"));
const PerformancePmsPage = lazy(() => import("@/pages/performance/PerformancePmsPage"));
const VisitorManagementPage = lazy(() => import("@/pages/visitors/VisitorManagementPage"));
const WebhooksIntegrationsPage = lazy(() => import("@/pages/integrations/WebhooksIntegrationsPage"));
const StarBoardPage = lazy(() => import("@/pages/celebrations/StarBoardPage"));

// Employee Self-Service Pages
const EmployeePayBenefitsPage = lazy(() => import("@/pages/self-service/EmployeePayBenefitsPage"));
const EmployeeShiftRosterPage = lazy(() => import("@/pages/self-service/EmployeeShiftRosterPage"));
const EmployeeReimbursementsPage = lazy(() => import("@/pages/self-service/EmployeeReimbursementsPage"));
const EmployeeGrievancesPage = lazy(() => import("@/pages/self-service/EmployeeGrievancesPage"));

function EmployeeDirectoryRoute() {
  const user = useAuthStore((state) => state.user);
  const { has } = usePermissions();
  if (!user) return <Navigate to="/login" replace />;
  if (!has("employees:view_all")) {
    return <Navigate to={`/employees/${user.id}`} replace />;
  }
  return <EmployeeDirectoryPage />;
}

export const hrmsRoutes = (
  <>
    <Route path="/self-service" element={<Navigate to="/my-profile" replace />} />
    <Route path="/employees" element={<EmployeeDirectoryRoute />} />
    <Route path="/employees/probation" element={<ProbationPage />} />
    <Route path="/employees/import" element={<ImportEmployeesPage />} />
    <Route path="/employees/add" element={<ImportEmployeesPage />} />
    <Route path="/employees/:id" element={<EmployeeProfilePage />} />
    <Route path="/org-chart" element={<OrgChartPage />} />
    <Route path="/attendance" element={<AttendanceDashboardPage />} />
    <Route path="/attendance/my" element={<AttendancePage />} />
    <Route path="/attendance/shifts" element={<ShiftsPage />} />
    <Route path="/attendance/shift-schedule" element={<ShiftSchedulePage />} />
    <Route path="/attendance/regularizations" element={<RegularizationsPage />} />
    <Route path="/attendance/settings" element={<AttendanceSettingsPage />} />
    <Route path="/attendance/grid" element={<AttendanceGridPage />} />
    <Route path="/leave" element={<LeaveDashboardPage />} />
    <Route path="/leave/applications" element={<LeaveApplicationsPage />} />
    <Route path="/leave/calendar" element={<LeaveCalendarPage />} />
    <Route path="/leave/comp-off" element={<CompOffPage />} />
    <Route path="/leave/settings" element={<LeaveTypesPage />} />
    <Route path="/holidays" element={<HolidaysPage />} />
    <Route path="/documents" element={<DocumentsPage />} />
    <Route path="/documents/my" element={<MyDocumentsPage />} />
    <Route path="/documents/categories" element={<DocumentCategoriesPage />} />
    <Route path="/announcements" element={<AnnouncementsPage />} />
    <Route path="/policies" element={<PoliciesPage />} />

    {/* POSH Compliance */}
    <Route path="/posh" element={<PoshPage />} />
    <Route path="/posh/dashboard" element={<PoshPage />} />
    <Route path="/posh/icc" element={<PoshPage />} />
    <Route path="/posh/complaints" element={<PoshPage />} />
    <Route path="/posh/training" element={<PoshPage />} />

    {/* Statutory Payroll Configuration */}
    <Route path="/pfConfiguration" element={<StatutoryConfigPage />} />
    <Route path="/esiConfiguration" element={<StatutoryConfigPage />} />
    <Route path="/lwfConfiguration" element={<StatutoryConfigPage />} />
    <Route path="/ptConfiguration" element={<StatutoryConfigPage />} />
    <Route path="/incomeTaxSlabs" element={<StatutoryConfigPage />} />

    {/* Letters & Certificates */}
    <Route path="/letters-certificates" element={<LettersGeneratorPage />} />
    <Route path="/template" element={<LettersGeneratorPage />} />

    {/* Approval Delegation */}
    <Route path="/company/delegations" element={<DelegationsPage />} />

    {/* Task Assignment & Work Reports */}
    <Route path="/taskassignment/daily-work-report" element={<DailyWorkReportPage />} />
    <Route path="/taskassignment/employee-tasks" element={<DailyWorkReportPage />} />

    {/* PMS Performance Management */}
    <Route path="/pms/overview" element={<PerformancePmsPage />} />
    <Route path="/kraPerformanceManagement" element={<PerformancePmsPage />} />
    <Route path="/pms/review-cycles" element={<PerformancePmsPage />} />
    <Route path="/pms/calibration" element={<PerformancePmsPage />} />
    <Route path="/pms/my-dashboard" element={<PerformancePmsPage />} />

    {/* Visitor Management */}
    <Route path="/meetpoint/visitor-management" element={<VisitorManagementPage />} />
    <Route path="/meetpoint/appointments" element={<VisitorManagementPage />} />

    {/* Integrations & Webhooks */}
    <Route path="/integrations/webhooks" element={<WebhooksIntegrationsPage />} />
    <Route path="/integrations/api-clients" element={<WebhooksIntegrationsPage />} />
    <Route path="/integrations/tally" element={<WebhooksIntegrationsPage />} />
    <Route path="/integrations/zoho" element={<WebhooksIntegrationsPage />} />

    {/* Star Board */}
    <Route path="/star-board" element={<StarBoardPage />} />

    {/* Employee Self-Service Pay & Benefits */}
    <Route path="/empSalarySlip" element={<EmployeePayBenefitsPage />} />
    <Route path="/myLoans" element={<EmployeePayBenefitsPage />} />
    <Route path="/advanceSalary" element={<EmployeePayBenefitsPage />} />
    <Route path="/myTaxDeclaration" element={<EmployeePayBenefitsPage />} />
    <Route path="/myForm16" element={<EmployeePayBenefitsPage />} />
    <Route path="/myResignation" element={<EmployeePayBenefitsPage />} />

    {/* Employee Self-Service Roster & Shifts */}
    <Route path="/myRoster" element={<EmployeeShiftRosterPage />} />
    <Route path="/myShiftSwaps" element={<EmployeeShiftRosterPage />} />
    <Route path="/availableOpenShifts" element={<EmployeeShiftRosterPage />} />

    {/* Employee Self-Service Reimbursements & Travel */}
    <Route path="/apply-reimbursement" element={<EmployeeReimbursementsPage />} />
    <Route path="/reimbursement-history" element={<EmployeeReimbursementsPage />} />
    <Route path="/applyTravel" element={<EmployeeReimbursementsPage />} />
    <Route path="/myTravel" element={<EmployeeReimbursementsPage />} />

    {/* Employee Self-Service Grievances & Discipline */}
    <Route path="/grievance/file" element={<EmployeeGrievancesPage />} />
    <Route path="/myGrievances" element={<EmployeeGrievancesPage />} />
    <Route path="/myDisciplinary" element={<EmployeeGrievancesPage />} />
  </>
);

