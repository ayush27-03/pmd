import { useAuth } from "../context/AuthContext";
import StudentProjects from "./StudentProjects";
import FacultyProjects from "./FacultyProjects";
import AdminPanel from "./AdminPanel";

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return <div>Please login</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Welcome {user.name} ({user.role})
        </h1>

      </div>

      {user.role === "student" && <StudentProjects />}
      {user.role === "faculty" && <FacultyProjects />}
      {user.role === "admin" && <AdminPanel />}
    </div>
  );
}
