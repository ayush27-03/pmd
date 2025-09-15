const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Faculty = mongoose.model("Faculty", new mongoose.Schema({
  "Name of Faculty": String, 
  "Faculty_ID": String,
  "Faculty_Password": String
}));

router.post("/login", async (req, res) => {
  const { facultyId, name, password } = req.body;

console.log("Login Attempt:");
  console.log("Received Faculty_ID:", facultyId);
  console.log("Received Name of Faculty:", name);
  console.log("Received Password:", password);

try {
    const faculty = await Faculty.findOne({
      "Name of Faculty": name,
      "Faculty_ID": facultyId,
      "Faculty_Password": password
    },
    {
      collection: 'fac'
    }
    );

 console.log("👉 Faculty Found:", faculty); // ADD THIS LINE
    if (!faculty) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
