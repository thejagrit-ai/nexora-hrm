import { lazy } from "react";
import { Route } from "react-router-dom";

const PayrollDashboardPage = lazy(() => import("@/pages/payroll/PayrollDashboardPage"));
const PayrollEmployeesPage = lazy(() => import("@/pages/payroll/PayrollEmployeesPage"));
const SalaryPage = lazy(() => import("@/pages/payroll/SalaryPage"));
const PayrollRunsPage = lazy(() => import("@/pages/payroll/PayrollRunsPage"));
const PayslipsPage = lazy(() => import("@/pages/payroll/PayslipsPage"));
const TaxesPage = lazy(() => import("@/pages/payroll/TaxesPage"));

export const payrollRoutes = [
  <Route key="payroll-dashboard" path="/payroll" element={<PayrollDashboardPage />} />,
  <Route key="payroll-employees" path="/payroll/employees" element={<PayrollEmployeesPage />} />,
  <Route key="payroll-salary" path="/payroll/salary" element={<SalaryPage />} />,
  <Route key="payroll-runs" path="/payroll/runs" element={<PayrollRunsPage />} />,
  <Route key="payroll-payslips" path="/payroll/payslips" element={<PayslipsPage />} />,
  <Route key="payroll-taxes" path="/payroll/taxes" element={<TaxesPage />} />,
];
