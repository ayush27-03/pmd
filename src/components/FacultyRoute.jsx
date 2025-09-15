import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function FacultyRoute({ children }) {
  const { faculty } = useAuth();
  if (!faculty) {
    return <Navigate to="/faculty-login" replace />;
  }
  return children;
}
