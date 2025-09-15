// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && token) {
      setUser(savedUser);
    }
  }, [token]);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setToken(data.token);
  };
  
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



// ->>>>>>>>>>>>>>>>>>>>>>>>>>>recently change 

// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);        // For students
//   const [faculty, setFaculty] = useState(null);  // For faculty

//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//     const savedFaculty = JSON.parse(localStorage.getItem("loggedInFaculty"));
//     if (savedUser) setUser(savedUser);
//     if (savedFaculty) setFaculty(savedFaculty);
//   }, []);

//   // Student login
//   const login = (email, password) => {
//     const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
//     const found = users.find((u) => u.email === email && u.password === password);
//     if (found) {
//       localStorage.setItem("loggedInUser", JSON.stringify(found));
//       setUser(found);
//       return true;
//     }
//     return false;
//   };

//   // Student register
//   const register = (newUser) => {
//     const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
//     users.push(newUser);
//     localStorage.setItem("registeredUsers", JSON.stringify(users));
//   };

//   // Faculty login (with hardcoded or saved faculty list)
//   const facultyLogin = (facultyId, name, password) => {
//     const faculties = JSON.parse(localStorage.getItem("registeredFaculties") || "[]");
//     const found = faculties.find(
//       (f) => f.facultyId === facultyId && f.name === name && f.password === password
//     );

//     if (found) {
//       localStorage.setItem("loggedInFaculty", JSON.stringify(found));
//       setFaculty(found);
//       return true;
//     }
//     return false;
//   };

//   const logoutStudent = () => {
//     localStorage.removeItem("loggedInUser");
//     setUser(null);
//   };

//   const logoutFaculty = () => {
//     localStorage.removeItem("loggedInFaculty");
//     setFaculty(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         faculty,
//         login,
//         register,
//         logoutStudent,
//         facultyLogin,
//         logoutFaculty,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
















// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Check localStorage for logged-in user
//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//     if (savedUser) setUser(savedUser);
//   }, []);

//   const login = (email, password) => {
//     const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
//     const found = users.find((u) => u.email === email && u.password === password);

//     if (found) {
//       localStorage.setItem("loggedInUser", JSON.stringify(found));
//       setUser(found);
//       return true;
//     }
//     return false;
//   };

//   const register = (newUser) => {
//     const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
//     users.push(newUser);
//     localStorage.setItem("registeredUsers", JSON.stringify(users));
//   };

//   const logout = () => {
//     localStorage.removeItem("loggedInUser");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






















// import { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // {role: "student/faculty/admin", name: "John"}

//   const login = (role, name) => {
//     setUser({ role, name });
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
