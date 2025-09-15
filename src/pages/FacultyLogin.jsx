// In src/pages/FacultyLogin.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth

export default function FacultyLogin() {
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginFacultyFromAPI } = useAuth(); // 2. Get the new function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/faculty/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: facultyId.trim(),
          name: name.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        // 3. On success, call the context function. It will handle everything.
        loginFacultyFromAPI(data.faculty); 
      } else {
        alert("Invalid Credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // The JSX for your form remains exactly the same.
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Faculty Login</h2>
        <input type="text" placeholder="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} required className="border p-2 w-full mb-3"/>
        <input type="text" placeholder="Faculty Name" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 w-full mb-3"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border p-2 w-full mb-3"/>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}


















//->>>>>>>>>>>>>>>>>>>>>>>>>>>> recent change
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function FacultyLogin() {
//   const [facultyId, setFacultyId] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/faculty/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           facultyId: facultyId.trim(),
//           name: name.trim(),
//           password: password.trim()
//         })
//       });

//       const data = await res.json();

//       if (data.success) {
//         // Optional: Store faculty info in localStorage
//         localStorage.setItem("faculty", JSON.stringify(data.faculty));

//         navigate("/faculty-dashboard");
//       } else {
//         alert("Invalid Credentials. Please try again.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       alert("An error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">Faculty Login</h2>

//         <input
//           type="text"
//           placeholder="Faculty ID"
//           className="border p-2 w-full mb-3"
//           value={facultyId}
//           onChange={(e) => setFacultyId(e.target.value)}
//           required
//         />

//         <input
//           type="text"
//           placeholder="Faculty Name"
//           className="border p-2 w-full mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }


















// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function FacultyLogin() {
//   const [facultyId, setFacultyId] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const { facultyLogin } = useAuth();

//   // Preload some faculty accounts for demo
//   useEffect(() => {
//     const existing = JSON.parse(localStorage.getItem("registeredFaculties") || "[]");
//     if (existing.length === 0) {
//       const demoFaculties = [
//         { facultyId: "FAC123", name: "Dr. Smith", password: "pass123" },
//         { facultyId: "FAC456", name: "Prof. Jane", password: "secure456" },
//         { facultyId: "FAC455", name: "Gunjan. Sharma", password: "secure46"}
//       ];
//       localStorage.setItem("registeredFaculties", JSON.stringify(demoFaculties));
//     }
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const success = facultyLogin(facultyId, name, password);

//     if (success) {
//       navigate("/faculty-dashboard");
     
//     } else {
//       alert("Invalid Credentials. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">Faculty Login</h2>

//         <input
//           type="text"
//           placeholder="Faculty ID"
//           className="border p-2 w-full mb-3"
//           value={facultyId}
//           onChange={(e) => setFacultyId(e.target.value)}
//           required
//         />

//         <input
//           type="text"
//           placeholder="Faculty Name"
//           className="border p-2 w-full mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
