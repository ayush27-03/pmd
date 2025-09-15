
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import ControlBar from "../components/ControlBar";

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();

  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {`` 
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch your projects");
        const data = await response.json();
        setMyProjects(data.projects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const ongoingProjects = myProjects.filter(
    (p) => p.status === "Open" || p.status === "In Progress"
  );
  const completedProjects = myProjects.filter((p) => p.status === "Completed");

  const stats = {
    ongoing: ongoingProjects.length,
    completed: completedProjects.length,
    deptAvailable: 123,
    programAvailable: 8 
  };
  const filteredProjects = ongoingProjects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="mt-2 text-lg">
            Welcome, <span className="font-semibold">{user?.name}</span>!
          </p>
          <p>Your Roll Number is: {user?.identifier}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 self-start"
        >
          Logout
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Ongoing Projects" value={stats.ongoing} />
        <StatCard title="Completed Projects" value={stats.completed} />
        <StatCard title="Total Projects Available" value={stats.deptAvailable} />
        <StatCard title="Program Projects" value={stats.programAvailable} />
      </div>

      <ControlBar
        title="My Ongoing Projects"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => setSelectedProject(project)}
            showProgress={true}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          You don't have any ongoing projects matching your search.
        </div>
      )}

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}





//  Code is working fine IST 23:32 28th Aug 2025



// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import StatCard from "../components/StatCard";
// import ProjectCard from "../components/ProjectCard";
// import ProjectDetailsModal from "../components/ProjectDetailsModal";
// import ControlBar from "../components/ControlBar";


// export default function StudentDashboard() {
//   const { user, token, logout } = useAuth();
  
//   // State for dynamic data from the backend
//   const [myProjects, setMyProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // State for UI interaction
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch('http://localhost:5000/api/student/dashboard', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         if (!response.ok) throw new Error('Failed to fetch your projects');
//         const data = await response.json();
//         setMyProjects(data.projects || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   // --- DYNAMIC DATA LOGIC ---+
//   // Filter projects based on their status directly from the fetched data
//   const ongoingProjects = myProjects.filter(p => p.status === "Open" || p.status === "In Progress");
//   const completedProjects = myProjects.filter(p => p.status === "Completed");

//   // Calculate stats dynamically
//   const stats = {
//     ongoing: ongoingProjects.length,
//     completed: completedProjects.length,
//     // These can be replaced with real API calls later if needed
//     deptAvailable: 123, // Placeholder for total projects
//     programAvailable: 8 // Example value
//   };

//   // Filter the ongoing projects for display based on the search term
//   const filteredProjects = ongoingProjects.filter(p =>
//     p.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="p-6 text-center">Loading dashboard...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="p-4 md:p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
//           <p className="mt-2 text-lg">Welcome, <span className="font-semibold">{user?.name}</span>!</p>
//           <p>Your Roll Number is: {user?.identifier}</p>
//         </div>
//         <button onClick={logout} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 self-start">
//           Logout
//         </button>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <StatCard title="Ongoing Projects" value={stats.ongoing} />
//         <StatCard title="Completed Projects" value={stats.completed} />
//         <StatCard title="Total Projects Available" value={stats.deptAvailable} />
//         <StatCard title="Program Projects" value={stats.programAvailable} />
//       </div>

//       <ControlBar
//         title="My Ongoing Projects"
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//       />

//       {/* ** THIS NOW USES DYNAMIC DATA ** */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//         {filteredProjects.map((project) => (
//           <ProjectCard
//             key={project._id} // Use the database ID
//             project={project}
//             onClick={() => setSelectedProject(project)}
//             showProgress={true}
//           />
//         ))}
//       </div>

//       {filteredProjects.length === 0 && (
//         <div className="text-center py-10 text-gray-500">
//           You don't have any ongoing projects matching your search.
//         </div>
//       )}

//       <ProjectDetailsModal
//         project={selectedProject}
//         onClose={() => setSelectedProject(null)}
//       />
//     </div>
//   );
// }








































/*
import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";
import sampleProjects from "../data/sampleProjects";
import ControlBar from "../components/ControlBar";

export default function StudentDashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const ongoingProjects = sampleProjects.filter(p => p.studentStatus === "Ongoing");
  const completedProjects = sampleProjects.filter(p => p.studentStatus === "Completed");

  const stats = {
    ongoing: ongoingProjects.length,
    completed: completedProjects.length,
    deptAvailable: sampleProjects.filter(p => p.status === "Available").length,
    schoolAvailable: 15, // Example value
    programAvailable: 8 // Example value
  };

  const filteredProjects = ongoingProjects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { user, token, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({ projects: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/student/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);


  return (
    <div className="p-4 md:p-6">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="mt-2 text-lg">Welcome, <span className="font-semibold">{user?.name}</span>!</p>
        <p>Your Roll Number is: {user?.identifier}</p>
        <button onClick={logout} className="px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
      {/* Stats Overview 
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Ongoing Projects" value={stats.ongoing} />
        <StatCard title="Completed Projects" value={stats.completed} />
        <StatCard title="Dept. Projects Available" value={stats.deptAvailable} />
        <StatCard title="Program Projects" value={stats.programAvailable} />
      </div>

      <ControlBar
        title="My Ongoing Projects"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
            showProgress={true}
          />
        ))}
      </div>

      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">My Projects ({dashboardData.projects.length})</h3>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {dashboardData.projects.length > 0 ? (
            dashboardData.projects.map(project => (
              <li key={project._id} className="p-2 bg-white rounded shadow">{project.title}</li>
            ))
          ) : (
            <li className="p-2 text-gray-500">You have not applied to any projects yet.</li>
          )}
        </ul>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          You don't have any ongoing projects
        </div>
      )}

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
*/