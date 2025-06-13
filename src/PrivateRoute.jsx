import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth(); // ✅ include loading

  if (loading) return <div>Loading...</div>; // ✅ wait for auth check

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;
