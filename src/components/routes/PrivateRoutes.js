import { useLocation, Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const location = useLocation();

  const auth = JSON.parse(localStorage.getItem("user"));

  const content = auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  return content;
}
