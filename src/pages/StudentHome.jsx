import React, { useState, useEffect } from 'react';

// --- MOCK/PLACEHOLDER COMPONENTS & HOOKS ---
// These are placeholders to allow this component to compile and run independently.
// You should replace them with your actual imports.

// Mock AuthContext Hook
const useAuth = () => ({
  user: { name: 'Jane Doe', identifier: 'S12345' },
  token: 'fake-token-for-demo',
  logout: () => console.log('Logout clicked!'),
});

// Mock UI Components
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const ProjectCard = ({ project, onClick }) => (
  <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md" onClick={onClick}>
    <h4 className="font-bold text-lg">{project.title}</h4>
    <p className="text-sm text-gray-600">Faculty: {project.facultyName}</p>
    <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
        </div>
    </div>
  </div>
);

const ProjectDetailsModal = ({ project, onClose }) => {
  if (!project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
        <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
        <p><strong>Description:</strong> {project.description}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

const ControlBar = ({ title, searchTerm, onSearchChange }) => (
  <div className="flex justify-between items-center mt-6">
    <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
    <input
      type="text"
      placeholder="Search projects..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="px-4 py-2 border rounded-lg"
    />
  </div>
);


// --- MAIN COMPONENT LOGIC ---

export default function StudentHome() {
  const { user, token, logout } = useAuth();

  // Using mock data since the backend isn't connected in this preview
  const [myProjects, setMyProjects] = useState([
      { _id: '1', title: 'AI-Powered Chatbot', facultyName: 'Dr. Smith', status: 'In Progress', progress: 75, description: 'A chatbot for student inquiries.' },
      { _id: '2', title: 'IoT Weather Station', facultyName: 'Dr. Jones', status: 'Open', progress: 20, description: 'A device to monitor local weather.' },
      { _id: '3', title: 'Mobile App for Campus Navigation', facultyName: 'Dr. Lee', status: 'Completed', progress: 100, description: 'An app to navigate the university campus.' }
  ]);
  const [loading, setLoading] = useState(false); // Set to false for demo
  const [error, setError] = useState('');

  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // The useEffect for fetching data is commented out for this demo
  // to prevent errors when running without a backend.
  /*
  useEffect(() => {
    const fetchData = async () => {
      // ... fetch logic would go here
    };
    fetchData();
  }, [token]);
  */

  const ongoingProjects = myProjects.filter(p => p.status === "Open" || p.status === "In Progress");
  const completedProjects = myProjects.filter(p => p.status === "Completed");

  const stats = {
    ongoing: ongoingProjects.length,
    completed: completedProjects.length,
    deptAvailable: 123,
    programAvailable: 8
  };

  const filteredProjects = ongoingProjects.filter(p =>
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
          <p className="mt-2 text-lg">Welcome, <span className="font-semibold">{user?.name}</span>!</p>
          <p>Your Roll Number is: {user?.identifier}</p>
        </div>
        <button onClick={logout} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 self-start">
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