import { useState } from "react";

const sampleProjects = [
  { id: 1, title: "AI Chatbot", mentor: "Prof. Smith" },
  { id: 2, title: "Blockchain Voting", mentor: "Prof. Jane" },
];

export default function StudentProjects() {
  const [registeredProjects, setRegisteredProjects] = useState([]);

  const registerProject = (project) => {
    setRegisteredProjects([...registeredProjects, project]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {sampleProjects.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{p.title}</h3>
            <p>Mentor: {p.mentor}</p>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded mt-2"
              onClick={() => registerProject(p)}
            >
              Register
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">Your Registered Projects</h2>
      <ul className="mt-2">
        {registeredProjects.map((p) => (
          <li key={p.id} className="p-2 bg-gray-200 mt-1 rounded">
            ✅ {p.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
