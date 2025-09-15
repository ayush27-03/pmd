import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import { Bar } from "react-chartjs-2";


export default function FacultyDashboard() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState(facultyProjects);
  const [dashboardData, setDashboardData] = useState({ projects: [], studentCount: 0 });
  const [applications, setApplications] = useState(allApplications);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    maxStudents: "",
    deadline: "",
    department: "",
    categories: []
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [error, setError] = useState('');

  // Statistics calculations
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const totalStudentsEnrolled = projects.reduce((sum, p) => sum + p.studentsEnrolled, 0);
  const pendingApplications = applications.filter(a => a.status === "Pending").length;
  const [schoolFilter, setSchoolFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [newProjectFile, setNewProjectFile] = useState(null);
  const [newProjectSchool, setNewProjectSchool] = useState("");
  const [newProjectProgram, setNewProjectProgram] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/faculty/dashboard', {
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesSchool = !schoolFilter || project.school === schoolFilter;
    const matchesProgram = !programFilter || project.program === programFilter;
    return matchesSearch && matchesStatus && matchesSchool && matchesProgram;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle application status change
  const handleApplicationStatus = (appId, newStatus) => {
    const updatedApplications = applications.map(app =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);

    // Update project's studentsEnrolled if approved
    if (newStatus === "Approved") {
      const app = applications.find(a => a.id === appId);
      if (app) {
        const updatedProjects = projects.map(proj =>
          proj.id === app.projectId
            ? { ...proj, studentsEnrolled: proj.studentsEnrolled + 1 }
            : proj
        );
        setProjects(updatedProjects);
      }
    }
  };

  // Handle new project submission
  const handleNewProjectSubmit = (e) => {
    e.preventDefault();
    const newProj = {
      id: projects.length + 1,
      title: newProject.title,
      description: newProject.description,
      status: "Active",
      studentsEnrolled: 0,
      maxStudents: parseInt(newProject.maxStudents),
      deadline: newProject.deadline,
      department: newProject.department,
      school: newProjectSchool,
      program: newProjectProgram,
      categories: newProject.categories.split(",").map(c => c.trim()),
      applications: [],
      milestones: []
    };
    setProjects([...projects, newProj]);
    setNewProject({
      title: "",
      description: "",
      maxStudents: "",
      deadline: "",
      department: "",
      categories: []
    });
    setNewProjectSchool("");
    setNewProjectProgram("");
    setShowNewProjectForm(false);
  };

  // Handle milestone completion toggle
  const toggleMilestoneCompletion = (projectId, milestoneId) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? {
          ...project,
          milestones: project.milestones.map(milestone =>
            milestone.id === milestoneId
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          )
        }
        : project
    ));
  };

  // Chart data for projects by status
  const projectsChartData = {
    labels: ["Active", "Completed"],
    datasets: [
      {
        label: "Projects",
        data: [activeProjects, completedProjects],
        backgroundColor: ["#3b82f6", "#10b981"],
      }
    ]
  };

  // Chart data for student enrollment
  const enrollmentChartData = {
    labels: projects.map(p => p.title),
    datasets: [
      {
        label: "Enrolled Students",
        data: projects.map(p => p.studentsEnrolled),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Max Capacity",
        data: projects.map(p => p.maxStudents),
        backgroundColor: "#d1d5db",
      }
    ]
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-blue-600">{user?.name}</span>
          </h1>
          <p className="text-gray-600">Faculty ID: {user?.identifier}</p>
        </div>
        <button
          onClick={logout}
          className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
        >
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-xl font-bold">{activeProjects}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Projects</p>
              <p className="text-xl font-bold">{completedProjects}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Students Enrolled</p>
              <p className="text-xl font-bold">{totalStudentsEnrolled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Applications</p>
              <p className="text-xl font-bold">{pendingApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "projects" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("projects")}
        >
          My Projects
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "applications" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "analytics" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-lg px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>


              <select
                className="border rounded-lg px-3 py-2"
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
              >
                <option value="">All Schools</option>
                <option value="Engineering">Engineering</option>
                <option value="Science">Science</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">All Programs</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="PhD">PhD</option>
              </select>

            </div>
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
              New Project
            </button>
          </div>

          {/* New Project Form Modal */}
          {showNewProjectForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Create New Project</h3>
                  <button onClick={() => setShowNewProjectForm(false)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleNewProjectSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Project Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className="w-full p-2 border rounded min-h-[100px]"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Max Students</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={newProject.maxStudents}
                          onChange={(e) => setNewProject({ ...newProject, maxStudents: e.target.value })}
                          required
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded"
                          value={newProject.deadline}
                          onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={newProject.department}
                          onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Physics">Physics</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Biology">Biology</option>
                        </select>
                      </div>


                      <div>
                        <label className="block text-sm font-medium mb-1">School</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={newProjectSchool}
                          onChange={(e) => setNewProjectSchool(e.target.value)}
                        >
                          <option value="">Select School</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Science">Science</option>
                        </select>
                      </div>


                      <div>
                        <label className="block text-sm font-medium mb-1">Program</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={newProjectProgram}
                          onChange={(e) => setNewProjectProgram(e.target.value)}
                        >
                          <option value="">Select Program</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </div>



                      <div>
                        <label className="block text-sm font-medium mb-1">Categories (comma separated)</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={newProject.categories}
                          onChange={(e) => setNewProject({ ...newProject, categories: e.target.value })}
                          placeholder="AI, Machine Learning, Healthcare"
                        />
                      </div>


                      <div>
                        <label className="block text-sm font-medium mb-1">Upload File (CSV, XLSX)</label>
                        <input
                          type="file"
                          className="w-full p-2 border rounded"
                          onChange={(e) => setNewProjectFile(e.target.files[0])}
                        />
                        {newProjectFile && (
                          <p className="text-sm mt-1 text-green-600">Selected: {newProjectFile.name}</p>
                        )}
                      </div>





                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowNewProjectForm(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Projects Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("title")}
                  >
                    <div className="flex items-center">
                      Title
                      {sortConfig.key === "title" && (
                        sortConfig.direction === "asc" ?
                          <ArrowUpIcon className="ml-1 h-4 w-4" /> :
                          <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" && (
                        sortConfig.direction === "asc" ?
                          <ArrowUpIcon className="ml-1 h-4 w-4" /> :
                          <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("deadline")}
                  >
                    <div className="flex items-center">
                      Deadline
                      {sortConfig.key === "deadline" && (
                        sortConfig.direction === "asc" ?
                          <ArrowUpIcon className="ml-1 h-4 w-4" /> :
                          <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.school}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.program}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${project.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.studentsEnrolled}/{project.maxStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilIcon className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedProjects.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No projects found matching your criteria
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden border mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{application.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.projectTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.appliedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${application.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : application.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {application.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApplicationStatus(application.id, "Approved")}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(application.id, "Rejected")}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No applications found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-bold mb-4">Projects by Status</h3>
              <div className="h-64">
                <Bar
                  data={projectsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-bold mb-4">Student Enrollment</h3>
              <div className="h-64">
                <Bar
                  data={enrollmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                    },
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                        max: Math.max(...projects.map(p => p.maxStudents)) + 2
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedProject.title}</h3>
              <button
                onClick={() => setShowProjectDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 mb-4">{selectedProject.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-1">Department</h4>
                    <p>{selectedProject.department}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Status</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedProject.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Students</h4>
                    <p>{selectedProject.studentsEnrolled}/{selectedProject.maxStudents}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Deadline</h4>
                    <p>{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.categories.map((category, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Project Milestones</h4>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => toggleMilestoneCompletion(selectedProject.id, milestone.id)}
                        className="mt-1 mr-2"
                      />
                      <div>
                        <p className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Student Applications</h4>
              {selectedProject.applications.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied On
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProject.applications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{application.studentName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.appliedOn).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${application.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : application.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {application.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    handleApplicationStatus(application.id, "Approved");
                                    setSelectedProject({
                                      ...selectedProject,
                                      studentsEnrolled: selectedProject.studentsEnrolled + 1,
                                      applications: selectedProject.applications.map(app =>
                                        app.id === application.id ? { ...app, status: "Approved" } : app
                                      )
                                    });
                                  }}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    handleApplicationStatus(application.id, "Rejected");
                                    setSelectedProject({
                                      ...selectedProject,
                                      applications: selectedProject.applications.map(app =>
                                        app.id === application.id ? { ...app, status: "Rejected" } : app
                                      )
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No applications for this project</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowProjectDetails(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Mock Data
 // Mock data for user projects
const facultyProjects = [
  {
    id: 1,
    title: "AI for Medical Diagnosis",
    description: "Developing machine learning models for early disease detection",
    status: "Active",
    studentsEnrolled: 3,
    maxStudents: 5,
    deadline: "2023-12-15",
    department: "Computer Science",
    school: "Dental",
    program: "MBBS",
    categories: ["AI", "Healthcare"],
    applications: [
      { id: 101, studentName: "John Doe", status: "Approved", appliedOn: "2023-10-01" },
      { id: 102, studentName: "Jane Smith", status: "Pending", appliedOn: "2023-10-05" },
      { id: 103, studentName: "Alex Johnson", status: "Rejected", appliedOn: "2023-10-03" }
    ],
    milestones: [
      { id: 1, name: "Literature Review", dueDate: "2023-11-01", completed: true },
      { id: 2, name: "Data Collection", dueDate: "2023-11-15", completed: false },
      { id: 3, name: "Model Development", dueDate: "2023-12-01", completed: false }
    ]
  },
  {
    id: 2,
    title: "Quantum Computing Basics",
    description: "Introduction to quantum algorithms and their implementation",
    status: "Active",
    studentsEnrolled: 2,
    maxStudents: 4,
    deadline: "2024-02-20",
    school: "Quantum Electrodynamics",
    program: "B.Sc",
    department: "Physics",
    categories: ["Quantum", "Algorithms"],
    applications: [
      { id: 201, studentName: "Sarah Williams", status: "Approved", appliedOn: "2023-09-20" },
      { id: 202, studentName: "Michael Brown", status: "Approved", appliedOn: "2023-09-25" }
    ],
    milestones: [
      { id: 1, name: "Quantum Theory Review", dueDate: "2023-11-10", completed: true },
      { id: 2, name: "Qiskit Implementation", dueDate: "2024-01-15", completed: false }
    ]
  },
  {
    id: 3,
    title: "Blockchain for Voting Systems",
    description: "Developing secure voting systems using blockchain technology",
    status: "Completed",
    studentsEnrolled: 4,
    maxStudents: 4,
    deadline: "2023-06-30",
    department: "Computer Science",
    school: "Engineering",
    program: "B.Tech in Cybersecurity",
    categories: ["Blockchain", "Security"],
    applications: [],
    milestones: [
      { id: 1, name: "Requirement Analysis", dueDate: "2023-03-01", completed: true },
      { id: 2, name: "Prototype Development", dueDate: "2023-04-15", completed: true },
      { id: 3, name: "Testing & Validation", dueDate: "2023-06-01", completed: true }
    ]
  }
];

// Mock data for student applications
const allApplications = facultyProjects.flatMap(project =>
  project.applications.map(app => ({ ...app, projectId: project.id, projectTitle: project.title }))
  .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)));

 */


// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";

// export default function FacultyDashboard() {
//   const { user, logoutFaculty } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [newProject, setNewProject] = useState({
//     title: "",
//     description: "",
//     maxStudents: "",
//     deadline: "",
//     department: "",
//     school: "",
//     program: "",
//   });

//   const [filters, setFilters] = useState({
//     department: "",
//     school: "",
//     program: "",
//   });

//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [fileData, setFileData] = useState([]);

//   const departmentOptions = ["Computer Science", "Physics", "Mathematics", "Biology"];
//   const schoolOptions = ["School of Engineering", "School of Sciences", "School of Management"];
//   const programOptions = ["B.Tech", "M.Tech", "PhD", "MBA"];

//   const handleProjectSubmit = (e) => {
//     e.preventDefault();
//     const newEntry = {
//       ...newProject,
//       id: Date.now(),
//       studentsEnrolled: 0,
//       status: "Active",
//     };
//     setProjects([...projects, newEntry]);
//     setNewProject({
//       title: "",
//       description: "",
//       maxStudents: "",
//       deadline: "",
//       department: "",
//       school: "",
//       program: "",
//     });
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     setUploadedFile(file);
//     const reader = new FileReader();
//     reader.onload = () => {
//       const lines = reader.result.split("\n").map((line) => line.trim());
//       setFileData(lines);
//     };
//     reader.readAsText(file);
//   };

//   const filteredProjects = projects.filter((project) => {
//     return (
//       (!filters.department || project.department === filters.department) &&
//       (!filters.school || project.school === filters.school) &&
//       (!filters.program || project.program === filters.program)
//     );
//   });

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
//         <button onClick={logoutFaculty} className="bg-red-600 text-white px-4 py-2 rounded">
//           Logout
//         </button>
//       </div>

//       {/* PROJECT CREATION FORM */}
//       <div className="bg-white shadow p-6 rounded mb-6">
//         <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
//         <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Project Title"
//             value={newProject.title}
//             onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
//             className="border p-2 rounded"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Max Students"
//             value={newProject.maxStudents}
//             onChange={(e) => setNewProject({ ...newProject, maxStudents: e.target.value })}
//             className="border p-2 rounded"
//             required
//           />
//           <input
//             type="date"
//             value={newProject.deadline}
//             onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
//             className="border p-2 rounded"
//             required
//           />
//           <select
//             value={newProject.department}
//             onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
//             className="border p-2 rounded"
//             required
//           >
//             <option value="">Select Department</option>
//             {departmentOptions.map((d) => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>
//           <select
//             value={newProject.school}
//             onChange={(e) => setNewProject({ ...newProject, school: e.target.value })}
//             className="border p-2 rounded"
//             required
//           >
//             <option value="">Select School</option>
//             {schoolOptions.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>
//           <select
//             value={newProject.program}
//             onChange={(e) => setNewProject({ ...newProject, program: e.target.value })}
//             className="border p-2 rounded"
//             required
//           >
//             <option value="">Select Program</option>
//             {programOptions.map((p) => (
//               <option key={p}>{p}</option>
//             ))}
//           </select>
//           <textarea
//             placeholder="Project Description"
//             value={newProject.description}
//             onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
//             className="border p-2 rounded col-span-1 md:col-span-2"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 rounded col-span-1 md:col-span-2"
//           >
//             Submit Project
//           </button>
//         </form>
//       </div>

//       {/* FILE UPLOAD */}
//       <div className="bg-white shadow p-6 rounded mb-6">
//         <h2 className="text-xl font-semibold mb-4">Upload File (CSV or Text)</h2>
//         <input
//           type="file"
//           accept=".csv,.txt"
//           onChange={handleFileUpload}
//           className="border p-2 rounded"
//         />
//         {fileData.length > 0 && (
//           <div className="mt-4 bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
//             <h4 className="font-semibold">Uploaded File Preview:</h4>
//             <ul className="list-disc ml-6 text-sm text-gray-800">
//               {fileData.map((line, index) => (
//                 <li key={index}>{line}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* FILTERS */}
//       <div className="bg-white shadow p-6 rounded mb-6">
//         <h2 className="text-xl font-semibold mb-4">Filter Projects</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <select
//             value={filters.department}
//             onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//             className="border p-2 rounded"
//           >
//             <option value="">All Departments</option>
//             {departmentOptions.map((d) => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>
//           <select
//             value={filters.school}
//             onChange={(e) => setFilters({ ...filters, school: e.target.value })}
//             className="border p-2 rounded"
//           >
//             <option value="">All Schools</option>
//             {schoolOptions.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>
//           <select
//             value={filters.program}
//             onChange={(e) => setFilters({ ...filters, program: e.target.value })}
//             className="border p-2 rounded"
//           >
//             <option value="">All Programs</option>
//             {programOptions.map((p) => (
//               <option key={p}>{p}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* PROJECTS DISPLAY */}
//       <div className="bg-white shadow p-6 rounded">
//         <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
//         {filteredProjects.length === 0 ? (
//           <p className="text-gray-600">No projects match the selected filters.</p>
//         ) : (
//           filteredProjects.map((proj) => (
//             <div key={proj.id} className="mb-4 border p-4 rounded">
//               <h3 className="text-lg font-bold">{proj.title}</h3>
//               <p>{proj.description}</p>
//               <p className="text-sm text-gray-600 mt-1">
//                 Dept: {proj.department} | School: {proj.school} | Program: {proj.program}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

