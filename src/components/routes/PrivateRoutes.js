import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contextApi/auth";
export default function PrivateRoutes() {
  const location = useLocation();

  const { auth } = useAuth();

  const content =
    auth?.user !== null ? (
      <Outlet />
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    );

  return content;
}
