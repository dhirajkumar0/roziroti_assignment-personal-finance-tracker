import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ component: Component }) {
  const token = Cookies.get("auth_token");
  return token ? <Component /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
