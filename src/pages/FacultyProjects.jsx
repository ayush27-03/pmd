import { useState } from "react";

export default function FacultyProjects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");

  const addProject = () => {
    if (!newProject) return;
    setProjects([...projects, { id: Date.now(), title: newProject }]);
    setNewProject("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Post a New Project</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter project title"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button onClick={addProject} className="bg-blue-500 text-white px-3 py-1 rounded">
          Post
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Posted Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="p-2 bg-gray-100 mb-2 rounded">
            📌 {p.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
