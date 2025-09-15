
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectSubmissionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    department: "",
    deadline: "",
    requirements: ""
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic would go here
    console.log("Project submitted:", formData);
    navigate("/projects");
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submit New Project Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded min-h-[120px]"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="Blockchain">Blockchain</option>
              <option value="IoT">Internet of Things</option>
              <option value="Biotech">Biotechnology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            >
              <option value="">Select Department</option>
              <option value="CST">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expected Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements/Skills Needed</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Proposal
          </button>
        </div>
      </form>
    </div>
  );
}