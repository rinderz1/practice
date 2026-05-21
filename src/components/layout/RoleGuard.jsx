import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  const userRole = user?.systemRole || "";
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  return children;
}