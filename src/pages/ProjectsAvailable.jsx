// ProjectsAvailable.jsx
import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import ProjectCard from "../components/ProjectCard";

const sampleAvailableProjects = [
  {
    id: 1,
    title: "Machine Learning Research",
    department: "Computer Science",
    categories: ["AI", "Data Science"],
    status: "Application Available",
    deadline: "2023-12-15",
    description: "Research on neural networks for image recognition"
  },
  {
    id: 2,
    title: "Quantum Computing Study",
    department: "Physics",
    categories: ["Quantum", "Theoretical"],
    status: "Upcoming",
    deadline: "2024-01-10",
    description: "Exploring quantum algorithms"
  },
  {
    id: 3,
    title: "Biomedical Engineering Project",
    department: "Bioengineering",
    categories: ["Medical", "Engineering"],
    status: "Closed",
    deadline: "2023-11-30",
    description: "Developing medical imaging techniques"
  }
];

export default function ProjectsAvailable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    category: "all"
  });
  const [sortConfig, setSortConfig] = useState({ key: "deadline", direction: "asc" });
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredProjects = sampleAvailableProjects.filter(project => {
    return (
      (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.status === "all" || project.status === filters.status) &&
      (filters.department === "all" || project.department === filters.department) &&
      (filters.category === "all" || project.categories.includes(filters.category))
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Projects Available</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <select
              className="border rounded-lg px-3 py-2"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="Application Available">Available</option>
              <option value="Closed">Closed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
            
            <select
              className="border rounded-lg px-3 py-2"
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Bioengineering">Bioengineering</option>
            </select>
            
            <select
              className="border rounded-lg px-3 py-2"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="AI">AI</option>
              <option value="Data Science">Data Science</option>
              <option value="Quantum">Quantum</option>
              <option value="Medical">Medical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <button 
            onClick={() => requestSort("deadline")}
            className="flex items-center gap-1 text-sm"
          >
            Sort by Deadline
            {sortConfig.key === "deadline" && (
              sortConfig.direction === "asc" ? 
              <ArrowUpIcon className="h-4 w-4" /> : 
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            className="border rounded-lg px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.slice(0, itemsPerPage).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No projects found matching your criteria
        </div>
      )}
    </div>
  );
}