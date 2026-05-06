import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { RoleGuard } from "../../components/layout/RoleGuard";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { ROLES } from "../../constants/roles";
import HomePage from "../../pages/public/HomePage";
import ConferenceDetailsPage from "../../pages/public/ConferenceDetailsPage";
import ProgramPage from "../../pages/public/ProgramPage";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import AuthorDashboardPage from "../../pages/author/AuthorDashboardPage";
import PapersPage from "../../pages/author/PapersPage";
import SubmitPaperPage from "../../pages/author/SubmitPaperPage";
import PaperDetailsPage from "../../pages/author/PaperDetailsPage";
import PaperReviewsPage from "../../pages/author/PaperReviewsPage";
import RevisePaperPage from "../../pages/author/RevisePaperPage";
import EditProfilePage from "../../pages/author/EditProfilePage";
import ReviewerDashboardPage from "../../pages/reviewer/ReviewerDashboardPage";
import ReviewerPaperPage from "../../pages/reviewer/ReviewerPaperPage";
import ReviewSubmissionPage from "../../pages/reviewer/ReviewSubmissionPage";
import ChairConferenceDashboardPage from "../../pages/chair/ChairConferenceDashboardPage";
import ChairPapersPage from "../../pages/chair/ChairPapersPage";
import ChairPaperDetailsPage from "../../pages/chair/ChairPaperDetailsPage";
import ChairConferenceSettingsPage from "../../pages/chair/ChairConferenceSettingsPage";
import ChairConferenceExportPage from "../../pages/chair/ChairConferenceExportPage";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import UsersManagementPage from "../../pages/admin/UsersManagementPage";
import CreateConferencePage from "../../pages/admin/CreateConferencePage";
import AssignChairPage from "../../pages/admin/AssignChairPage";
import NotFoundPage from "../../pages/common/NotFoundPage";
import ForbiddenPage from "../../pages/common/ForbiddenPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="conferences/:id" element={<ConferenceDetailsPage />} />
        <Route path="conferences/:id/program" element={<ProgramPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="author/dashboard" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><AuthorDashboardPage /></RoleGuard>} />
        <Route path="papers" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><PapersPage /></RoleGuard>} />
        <Route path="papers/submit" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><SubmitPaperPage /></RoleGuard>} />
        <Route path="papers/:id" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><PaperDetailsPage /></RoleGuard>} />
        <Route path="papers/:id/reviews" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><PaperReviewsPage /></RoleGuard>} />
        <Route path="papers/:id/revise" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><RevisePaperPage /></RoleGuard>} />
        <Route path="profile/edit" element={<RoleGuard allowedRoles={[ROLES.AUTHOR]}><EditProfilePage /></RoleGuard>} />

        <Route path="reviewer/dashboard" element={<RoleGuard allowedRoles={[ROLES.REVIEWER]}><ReviewerDashboardPage /></RoleGuard>} />
        <Route path="reviewer/papers/:id" element={<RoleGuard allowedRoles={[ROLES.REVIEWER]}><ReviewerPaperPage /></RoleGuard>} />
        <Route path="reviewer/papers/:id/review" element={<RoleGuard allowedRoles={[ROLES.REVIEWER]}><ReviewSubmissionPage /></RoleGuard>} />

        <Route path="chair/conferences/:id" element={<RoleGuard allowedRoles={[ROLES.CHAIR]}><ChairConferenceDashboardPage /></RoleGuard>} />
        <Route path="chair/conferences/:id/papers" element={<RoleGuard allowedRoles={[ROLES.CHAIR]}><ChairPapersPage /></RoleGuard>} />
        <Route path="chair/papers/:id" element={<RoleGuard allowedRoles={[ROLES.CHAIR]}><ChairPaperDetailsPage /></RoleGuard>} />
        <Route path="chair/conferences/:id/settings" element={<RoleGuard allowedRoles={[ROLES.CHAIR]}><ChairConferenceSettingsPage /></RoleGuard>} />
        <Route path="chair/conferences/:id/export" element={<RoleGuard allowedRoles={[ROLES.CHAIR]}><ChairConferenceExportPage /></RoleGuard>} />

        <Route path="admin/dashboard" element={<RoleGuard allowedRoles={[ROLES.ADMIN]}><AdminDashboardPage /></RoleGuard>} />
        <Route path="admin/users" element={<RoleGuard allowedRoles={[ROLES.ADMIN]}><UsersManagementPage /></RoleGuard>} />
        <Route path="admin/conferences/create" element={<RoleGuard allowedRoles={[ROLES.ADMIN]}><CreateConferencePage /></RoleGuard>} />
        <Route path="admin/conferences/:id/chairs" element={<RoleGuard allowedRoles={[ROLES.ADMIN]}><AssignChairPage /></RoleGuard>} />
      </Route>

      <Route path="403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
