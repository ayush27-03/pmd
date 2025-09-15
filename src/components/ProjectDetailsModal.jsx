// components/ProjectDetailsModal.jsx
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Details</h3>
            <p className="text-gray-700 mb-4">{project.description}</p>
            
            <div className="space-y-2">
              <p><span className="font-medium">Faculty:</span> {project.faculty}</p>
              <p><span className="font-medium">Department:</span> {project.department}</p>
              <p><span className="font-medium">Status:</span> {project.status}</p>
              {project.deadline && (
                <p><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
              )}
              <p><span className="font-medium">Requirements:</span> {project.requirements}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>
            
            {project.milestones && (
              <>
                <h4 className="font-medium mb-2">Milestones</h4>
                <ul className="space-y-2">
                  {project.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        readOnly
                        className="mr-2"
                      />
                      <span className={milestone.completed ? "line-through text-gray-500" : ""}>
                        {milestone.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {project.categories?.map(category => (
              <span key={category} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Submission
          </button>
        </div>
      </div>
    </div>
  );
}

