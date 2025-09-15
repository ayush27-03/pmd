// export default function ProjectCard({ project, onClick }) {
//   const statusColors = {
//     "Application Available": "bg-green-100 text-green-800",
//     "Closed": "bg-red-100 text-red-800",
//     "Upcoming": "bg-orange-100 text-orange-800",
//   };

//   return (
//     <div
//       onClick={() => onClick(project)}
//       className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
//     >
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="text-lg font-bold">{project.title}</h3>
//         <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status]}`}>
//           {project.status}
//         </span>
//       </div>
//       <p className="text-sm text-gray-600">{project.faculty} - {project.departmentCategory}</p>
//       <p className="text-xs mt-1">Apply by: {project.applicationDeadline}</p>

//       {/* Progress Bar for ongoing projects */}
//       {project.progress !== undefined && (
//         <div className="mt-3">
//           <div className="h-2 bg-gray-200 rounded">
//             <div className="h-2 bg-blue-500 rounded" style={{ width: `${project.progress}%` }}></div>
//           </div>
//           <p className="text-xs mt-1">{project.progress}% Complete</p>
//         </div>
//       )}
//     </div>
//   );
// }


// components/ProjectCard.jsx
// export default function ProjectCard({ project, onClick, showProgress = false }) {
//   const progress = project.progress || 0; // Default to 0 if not provided
  
//   return (
//     <div 
//       className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//       onClick={() => onClick?.(project)}
//     >
//       <div className="flex justify-between items-start mb-2">
//         <h3 className="text-lg font-semibold">{project.title}</h3>
//         <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
//           {project.status || project.studentStatus}
//         </span>
//       </div>
      
//       <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      
//       {showProgress && (
//         <div className="mb-3">
//           <div className="flex justify-between text-xs text-gray-500 mb-1">
//             <span>Progress</span>
//             <span>{progress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-blue-600 h-2 rounded-full" 
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}
      
//       <div className="flex flex-wrap gap-2 mt-2">
//         {project.categories?.map(category => (
//           <span key={category} className="text-xs px-2 py-1 bg-gray-100 rounded">
//             {category}
//           </span>
//         ))}
//       </div>
      
//       {project.deadline && (
//         <div className="mt-3 text-sm text-gray-500">
//           Deadline: {new Date(project.deadline).toLocaleDateString()}
//         </div>
//       )}
//     </div>
//   );
// }

// components/ProjectCard.jsx


export default function ProjectCard({ project, onClick, showProgress = false }) {
  const progress = project.progress || 0; // Default to 0 if not provided
  
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(project)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {project.status || project.studentStatus}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      
      {showProgress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {project.categories?.map(category => (
          <span key={category} className="text-xs px-2 py-1 bg-gray-100 rounded">
            {category}
          </span>
        ))}
      </div>
      
      {project.deadline && (
        <div className="mt-3 text-sm text-gray-500">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}