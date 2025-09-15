// EnrolledProjects.jsx
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProjectCard from "../components/ProjectCard";
import sampleProjects from "../data/sampleProjects";

export default function EnrolledProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const enrolledProjects = sampleProjects.filter(
    p => p.studentStatus === "Ongoing" || p.studentStatus === "Completed"
  );

  const filteredProjects = enrolledProjects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Enrolled Projects</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search enrolled projects..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          You haven't enrolled in any projects yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.slice(0, itemsPerPage).map((p) => (
            <ProjectCard 
              key={p.id} 
              project={p} 
              showProgress={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}