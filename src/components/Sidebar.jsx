
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  // Adjusted paths to be absolute and consistent with App.jsx
  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="h-5 w-5" />, path: "/student-dashboard" },
    { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/student-profile" }, // placeholder if profile route is added
    { name: "Projects Available", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/projects" },
    { name: "Enrolled Projects", icon: <CheckCircleIcon className="h-5 w-5" />, path: "/enrolled-projects" },
    { name: "Ongoing Projects", icon: <ChartBarIcon className="h-5 w-5" />, path: "/ongoing-projects" }
  ];

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="md:hidden p-3 fixed top-3 left-3 z-50 bg-gray-800 text-white rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full bg-gray-900 text-white w-64 p-4 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h1 className="text-xl font-bold mb-6">
          {user?.role === "student" ? "Student Panel" : "Panel"}
        </h1>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}




// Code works fine until here IST 22:13 at 28th August 2025

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   HomeIcon,
//   UserIcon,
//   ClipboardDocumentListIcon,
//   CheckCircleIcon,
//   ChartBarIcon
// } from "@heroicons/react/24/outline";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar() {
//   const [open, setOpen] = useState(true);

//   // Working until IST 00:39 31st Aug 2025
//   // const menuItems = [
//   // { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "dashboard" },
//   // { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "profile" },
//   // { name: "Projects Available", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "projects" },
//   // { name: "Enrolled Projects", icon: <CheckCircleIcon className="h-5 w-5" />, path: "enrolled" },
//   // { name: "Ongoing Projects", icon: <ChartBarIcon className="h-5 w-5" />, path: "ongoing" }
//   // ];


//   const menuItems = [
//     { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "profile" },
//     { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
//     { name: "Projects Available", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/projects" },
//     { name: "Enrolled Projects", icon: <CheckCircleIcon className="h-5 w-5" />, path: "/enrolled" },
//     { name: "Ongoing Projects", icon: <ChartBarIcon className="h-5 w-5" />, path: "/ongoing" }
//   ];

//   return (
//     <>
//       {/* Hamburger for small screens */}
//       <button
//         className="md:hidden p-3 fixed top-3 left-3 z-50 bg-gray-800 text-white rounded"
//         onClick={() => setOpen(!open)}
//       >
//         ☰
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed md:static top-0 left-0 h-full bg-gray-900 text-white w-64 p-4 transition-transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0`}
//       >
//         <h1 className="text-xl font-bold mb-6">Student Panel</h1>
//         <nav>
//           {menuItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
//             >
//               {item.icon} {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// }
