import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  const userRoles = user?.roles || [];
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
