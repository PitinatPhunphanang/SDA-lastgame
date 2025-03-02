import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("authToken"); // ดึง JWT จาก LocalStorage

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
