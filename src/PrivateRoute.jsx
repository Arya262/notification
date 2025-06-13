import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth(); // ✅ include loading

<<<<<<< HEAD
  if (loading) return <div>Loading...</div>;
=======
  if (loading) return <div>Loading...</div>; // ✅ wait for auth check
>>>>>>> 52f1ad304b7fd7bbec33006b8bbd74ff0ab3d730

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;
