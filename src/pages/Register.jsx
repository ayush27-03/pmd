import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = { name, email, password, role: "student" };
    register(newUser);

    alert("✅ Registered successfully! Please login.");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Student Registration</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Register
        </button>

        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}



























// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("student");
//   const [password, setPassword] = useState("");

//   const handleRegister = (e) => {
//     e.preventDefault();

//     // For now, just store user in localStorage (mock backend)
//     const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

//     const newUser = { name, email, role, password };
//     localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

//     alert("✅ Registered successfully! You can now login.");
//     navigate("/"); // go to login page
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleRegister}
//         className="bg-white p-6 rounded shadow-md w-96"
//       >
//         <h2 className="text-2xl font-bold mb-4">Register</h2>

//         <input
//           type="text"
//           placeholder="Full Name"
//           className="border p-2 w-full mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 w-full mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <select
//           className="border p-2 w-full mb-3"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="student">Student</option>
//           <option value="faculty">Faculty</option>
//           <option value="admin">Admin</option>
//         </select>

//         <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
//           Register
//         </button>

//         <p className="text-center mt-3 text-sm">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/")}
//             className="text-blue-500 cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }
