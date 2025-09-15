
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// pages
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import UnifiedLogin from "./pages/Unifiedlogin";

// components
import Sidebar from "./components/Sidebar";

// Private route wrapper
function PrivateRoute({ children, requiredRole }) {
  const { user, token } = useAuth();
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public login */}
      <Route path="/login" element={<UnifiedLogin />} />

      {/* Student dashboard with sidebar layout */}
      <Route
        path="/student-dashboard"
        element={
          <PrivateRoute requiredRole="student">
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-4 md:ml-64">
                <StudentDashboard />
              </main>
            </div>
          </PrivateRoute>
        }
      />

      {/* Faculty dashboard */}
      <Route
        path="/faculty-dashboard"
        element={
          <PrivateRoute requiredRole="faculty">
            <FacultyDashboard />
          </PrivateRoute>
        }
      />

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}








// Code works fine until here IST 22:13 at 28th August 2025

// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// //pages
// import StudentDashboard from "./pages/StudentDashboard";
// import FacultyDashboard from "./pages/FacultyDashboard";
// import Sidebar from "./components/Sidebar";
// import UnifiedLogin from "./pages/Unifiedlogin";

// function PrivateRoute({ children, requiredRole }) {
//   const { user, token } = useAuth();
//   if (!token || !user) {
//     return <Navigate to="/login" />;
//   }
//   if (user.role !== requiredRole) {

//     return <Navigate to="/login" />;
//   }
//   return children;
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* ✅ STUDENT FLOW */}
//       <Route path="/login" element={<UnifiedLogin />} />
//       <Route
//         path="/student-dashboard"
//         element={
//           <PrivateRoute requiredRole="student">
//             <div className="flex">
//               <Sidebar />
//               <main className="flex-1 p-4 md:ml-64">
//                 <StudentDashboard />
//               </main>
//             </div>
//           </PrivateRoute>
//         }
//       />

//       {/* Faculty Dashboard */}
//       <Route
//         path="/faculty-dashboard"
//         element={
//           <PrivateRoute requiredRole="faculty">
//             <FacultyDashboard />
//           </PrivateRoute>
//         }
//       />

//       {/* Default-Role */}
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }


/*
// import Login from "./pages/Login";
// import PrivateRoute from "./components/PrivateRoute"; //optimization needed
// import ProjectsAvailable from "./pages/ProjectsAvailable";
// import EnrolledProjects from "./pages/EnrolledProjects";
// import OngoingProjects from "./pages/OngoingProjects";
// import Profile from "./pages/Profile";
// import Register from "./pages/Register";

// Faculty pages
// import FacultyLogin from "./pages/FacultyLogin";
// import FacultyDashboard from "./pages/FacultyDashboard";
// import FacultyRoute from "./components/FacultyRoute";

//  {/* <Route
//  path="/projects"
//  element={
//           <PrivateRoute>
//             <div className="flex">
//               <Sidebar />
//               <main className="flex-1 p-4 md:ml-64">
//                 <ProjectsAvailable />
//               </main>
//             </div>
//           </PrivateRoute>
//         }
//       /> */
