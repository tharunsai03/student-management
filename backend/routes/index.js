const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");
const Student = require("../models/Student");
const Course = require("../models/Course");

// ===== USER CRUD =====
router.post("/user", async (req,res)=>{
  res.send(await User.create(req.body));
});

router.get("/user", async (req,res)=>{
  res.send(await User.find());
});

router.put("/user/:id", async (req,res)=>{
  res.send(await User.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete("/user/:id", async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// ===== POST CRUD =====
router.post("/post", async (req,res)=>{
  res.send(await Post.create(req.body));
});

router.get("/post", async (req,res)=>{
  res.send(await Post.find().populate("userId"));
});

router.put("/post/:id", async (req,res)=>{
  res.send(await Post.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete("/post/:id", async (req,res)=>{
  await Post.findByIdAndDelete(req.params.id);
  res.send("Post Deleted");
});

// ===== STUDENT CRUD =====
router.post("/student", async (req,res)=>{
  res.send(await Student.create(req.body));
});

router.get("/student", async (req,res)=>{
  res.send(await Student.find().populate("courses"));
});

router.put("/student/:id", async (req,res)=>{
  res.send(await Student.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete("/student/:id", async (req,res)=>{
  await Student.findByIdAndDelete(req.params.id);
  res.send("Student Deleted");
});

// ===== COURSE CRUD =====
router.post("/course", async (req,res)=>{
  res.send(await Course.create(req.body));
});

router.get("/course", async (req,res)=>{
  res.send(await Course.find().populate("students"));
});

router.put("/course/:id", async (req,res)=>{
  res.send(await Course.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete("/course/:id", async (req,res)=>{
  await Course.findByIdAndDelete(req.params.id);
  res.send("Course Deleted");
});

// ===== ENROLL =====
router.post("/enroll", async (req,res)=>{
  const {studentId, courseId} = req.body;

  await Student.findByIdAndUpdate(studentId, {
    $addToSet: { courses: courseId }
  });

  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { students: studentId }
  });

  res.send("Enrolled");
});

// ===== UNENROLL (NEW) =====
router.post("/unenroll", async (req,res)=>{
  const {studentId, courseId} = req.body;

  await Student.findByIdAndUpdate(studentId, {
    $pull: { courses: courseId }
  });

  await Course.findByIdAndUpdate(courseId, {
    $pull: { students: studentId }
  });

  res.send("Unenrolled");
});

module.exports = router;