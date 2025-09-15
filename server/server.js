import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- App & DB Setup ---
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/pmd';
const JWT_SECRET = 'your-super-secret-key-12345';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to 'pmd' database"))
  .catch((err) => console.error("❌ Mongo connection error:", err));

// --- Mongoose Schemas & Models ---
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { collection: 'students' });

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'faculty' }
}, { collection: 'faculties' });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  primaryFacultyMentorId: mongoose.Schema.Types.ObjectId,
  status: String,
  disciplinesInvolved: String,
  appliedStudentIds: [mongoose.Schema.Types.ObjectId]
}, { collection: 'projects', strict: false });

const Faculty = mongoose.model('Faculty', facultySchema);
const Project = mongoose.model('Project', projectSchema);
const Student = mongoose.model('Student', studentSchema);


// --- JWT Verification Middleware ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};


// --- API Endpoints ---

// 1. **MODIFIED** Unified Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body;

    let user;
    // This part now handles both faculty and student roles
    if (role === 'faculty') {
      user = await Faculty.findOne({ facultyId: identifier });
    } else if (role === 'student') {
      user = await Student.findOne({ rollNumber: identifier });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        identifier: user.facultyId || user.rollNumber // Use facultyId OR rollNumber
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// 2. Faculty Dashboard Data Endpoint (This code is untouched)
app.get('/api/faculty/dashboard', verifyToken, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ message: 'Access denied: Not a faculty member' });
    }
    try {
        const mentoringProjects = await Project.find({ primaryFacultyMentorId: req.user.userId });
        res.json({
            projects: mentoringProjects,
            studentCount: 640
        });
    } catch (error) {
        console.error("Dashboard data error:", error);
        res.status(500).json({ message: 'Server error fetching faculty data' });
    }
});


// 3. **ADDED** Student Dashboard Data Endpoint
app.get('/api/student/dashboard', verifyToken, async (req, res) => {
    // Our security guard checks if the user is logged in and is a student
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied: Not a student' });
    }
    try {
        // Find all projects where the logged-in student's ID is in the 'appliedStudentIds' array
        const myProjects = await Project.find({ appliedStudentIds: req.user.userId });
        res.json({
            projects: myProjects
        });
    } catch (error) {
        console.error("Dashboard data error:", error);
        res.status(500).json({ message: 'Server error fetching student data' });
    }
});


// --- Server Start ---
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));







































/*
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

// --- App & DB Setup ---
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/pmd';
const JWT_SECRET = 'your-super-secret-key-12345';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to 'pmd' database"))
  .catch((err) => console.error("❌ Mongo connection error:", err));

// --- Mongoose Schemas & Models ---
// We define the structure of our data here

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { collection: 'students' });

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'faculty' }
}, { collection: 'faculties' });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  primaryFacultyMentorId: mongoose.Schema.Types.ObjectId, // This is the link to the faculty
  status: String,
  disciplinesInvolved: String,
  appliedStudentIds: [mongoose.Schema.Types.ObjectId]
}, { collection: 'projects', strict: false }); // strict: false helps avoid errors if there are extra fields

const Faculty = mongoose.model('Faculty', facultySchema);
const Project = mongoose.model('Project', projectSchema);
const Student = mongoose.model('Student', studentSchema);


// --- JWT Verification Middleware ---
// This is a security guard that checks if a user is logged in before giving them data
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expects "Bearer TOKEN"
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adds user info (like userId) to the request
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};


// --- API Endpoints ---

// 1. Unified Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body;

    // For now, we only care about the faculty login
    if (role !== 'faculty') {
      return res.status(400).json({ message: 'Only faculty login is enabled' });
    }

    const user = await Faculty.findOne({ facultyId: identifier });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If login is successful, create a "token" (like a temporary ID card)
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        identifier: user.facultyId
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. **THIS IS THE NEW, CRITICAL PART**
//    Faculty Dashboard Data Endpoint
app.get('/api/faculty/dashboard', verifyToken, async (req, res) => {
    // First, our security guard (verifyToken) checks if the user is logged in.
    // Then, we check if the logged-in user is actually a faculty member.
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ message: 'Access denied: Not a faculty member' });
    }

    try {
        // This is the magic: We find all projects where the 'primaryFacultyMentorId'
        // matches the ID of the user who is currently logged in.
        const mentoringProjects = await Project.find({ primaryFacultyMentorId: req.user.userId });

        res.json({
            projects: mentoringProjects,
            studentCount: 640 // Placeholder value for the stats card
        });
    } catch (error) {
        console.error("Dashboard data error:", error);
        res.status(500).json({ message: 'Server error fetching faculty data' });
    }
});


// --- Server Start ---
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
*/





































/**
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- App & DB Setup ---
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/pmd'; // Correct database name
const JWT_SECRET = 'your-super-secret-key-12345'; // Change this in a real project

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to 'pmd' database"))
  .catch((err) => console.error("❌ Mongo connection error:", err));


const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { collection: 'students' });

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'faculty' }
}, { collection: 'faculties' });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  primaryFacultyMentorId: mongoose.Schema.Types.ObjectId,
  status: String,
  appliedStudentIds: [mongoose.Schema.Types.ObjectId]
}, { collection: 'projects' });


const Student = mongoose.model('Student', studentSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Project = mongoose.model('Project', projectSchema);

// --- JWT Verification Middleware ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expects "Bearer TOKEN"
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};

// --- API Endpoints ---

// 1. Unified Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body;

    let user;
    if (role === 'faculty') {
      user = await Faculty.findOne({ facultyId: identifier });
    } else if (role === 'student') {
      user = await Student.findOne({ rollNumber: identifier });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        identifier: user.facultyId || user.rollNumber
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. NEW Student Dashboard Data Endpoint
// app.get('/api/student/dashboard', verifyToken, async (req, res) => {
//     if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
//     try {
//       const mentoringProjects = await Project.find({});
//     } catch (error) {
//         res.status(500).json({ message: 'Server error fetching student data' });
//     }
// });

// 2. ++ NEW Student Dashboard Data Endpoint ++
// app.get('/api/student/dashboard', verifyToken, async (req, res) => {
//     if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
//     try {
//         // Find projects where the student's ID is in the 'appliedStudentIds' array
//         const myProjects = await Project.find({ appliedStudentIds: req.user.userId });
//         res.json({
//             projects: myProjects
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error fetching student data' });
//     }
// });

// 2. Protected Endpoint for Dashboard Data (Example)
// app.get('/api/dashboard-data', (req, res) => {
//     // This is a placeholder for real dashboard data
//     res.json({
//       message: "Welcome to your dashboard! This is protected data."
//     });
// });


// --- Server Start ---
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
*/