import { lazy } from "react";
import { Route } from "react-router-dom";

const RecruitmentDashboardPage = lazy(() => import("@/pages/recruitment/RecruitmentDashboardPage"));
const JobsPage = lazy(() => import("@/pages/recruitment/JobsPage"));
const CandidatesPage = lazy(() => import("@/pages/recruitment/CandidatesPage"));
const PipelinePage = lazy(() => import("@/pages/recruitment/PipelinePage"));
const InterviewsPage = lazy(() => import("@/pages/recruitment/InterviewsPage"));
const OffersPage = lazy(() => import("@/pages/recruitment/OffersPage"));

export const recruitmentRoutes = [
  <Route key="recruitment-dashboard" path="/recruitment" element={<RecruitmentDashboardPage />} />,
  <Route key="recruitment-jobs" path="/recruitment/jobs" element={<JobsPage />} />,
  <Route key="recruitment-candidates" path="/recruitment/candidates" element={<CandidatesPage />} />,
  <Route key="recruitment-pipeline" path="/recruitment/pipeline" element={<PipelinePage />} />,
  <Route key="recruitment-interviews" path="/recruitment/interviews" element={<InterviewsPage />} />,
  <Route key="recruitment-offers" path="/recruitment/offers" element={<OffersPage />} />,
];
