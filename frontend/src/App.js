import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const API = "http://127.0.0.1:8000/api";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [editUserId, setEditUserId] = useState(null);

  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // ===== USER CRUD =====
  const fetchUsers = async ()=> {
    const res = await axios.get(`${API}/user`);
    setUsers(res.data);
  };

  const addUser = async ()=> {
    if(editUserId){
      await axios.put(`${API}/user/${editUserId}`, {name});
      setEditUserId(null);
    } else {
      await axios.post(`${API}/user`, {name});
    }
    setName("");
    fetchUsers();
  };

  const deleteUser = async(id)=> {
    await axios.delete(`${API}/user/${id}`);
    fetchUsers();
  };

  const editUser = (u)=>{
    setName(u.name);
    setEditUserId(u._id);
  };

  // ===== POSTS =====
  const fetchPosts = async ()=> {
    const res = await axios.get(`${API}/post`);
    setPosts(res.data);
  };

  const addPost = async ()=> {
    await axios.post(`${API}/post`, {
      title: postTitle,
      userId: selectedUser
    });
    setPostTitle("");
    fetchPosts();
  };

  const deletePost = async(id)=>{
    await axios.delete(`${API}/post/${id}`);
    fetchPosts();
  };

  // ===== STUDENTS & COURSES =====
  const fetchStudents = async ()=> {
    const res = await axios.get(`${API}/student`);
    setStudents(res.data);
  };

  const fetchCourses = async ()=> {
    const res = await axios.get(`${API}/course`);
    setCourses(res.data);
  };

  const addStudent = async ()=> {
    await axios.post(`${API}/student`, {name: studentName});
    setStudentName("");
    fetchStudents();
  };

  const deleteStudent = async(id)=>{
    await axios.delete(`${API}/student/${id}`);
    fetchStudents();
  };

  const addCourse = async ()=> {
    await axios.post(`${API}/course`, {title: courseName});
    setCourseName("");
    fetchCourses();
  };

  const deleteCourse = async(id)=>{
    await axios.delete(`${API}/course/${id}`);
    fetchCourses();
  };

  const enroll = async ()=> {
    await axios.post(`${API}/enroll`, {
      studentId: selectedStudent,
      courseId: selectedCourse
    });
    fetchStudents();
    fetchCourses();
  };

  const unenroll = async ()=>{
    await axios.post(`${API}/unenroll`, {
      studentId: selectedStudent,
      courseId: selectedCourse
    });
    fetchStudents();
    fetchCourses();
  };

  useEffect(()=>{
    fetchUsers();
    fetchPosts();
    fetchStudents();
    fetchCourses();
  }, []);

  return (
    <div className="App">
      <div className="container">

        <h1>Full CRUD with Relations</h1>

        {/* USER SECTION */}
        <div className="section">
          <h2>User CRUD</h2>

          <div>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter user name"
            />
            <button onClick={addUser}>
              {editUserId ? "Update" : "Add"}
            </button>
          </div>

          <div className="list">
            {users.map(u => (
              <div className="list-item" key={u._id}>
                <span>{u.name}</span>
                <div>
                  <button onClick={() => editUser(u)}>Edit</button>
                  <button onClick={() => deleteUser(u._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="section">
          <h2>Posts</h2>

          <div>
            <select onChange={(e) => setSelectedUser(e.target.value)}>
              <option>Select User</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>

            <input 
              placeholder="Post title"
              onChange={(e) => setPostTitle(e.target.value)} 
            />

            <button onClick={addPost}>Add Post</button>
          </div>

          <div className="list">
            {posts.map(p => (
              <div className="list-item" key={p._id}>
                <span>{p.title} → {p.userId?.name}</span>
                <button onClick={() => deletePost(p._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* STUDENTS & COURSES */}
        <div className="section">
          <h2>Students & Courses</h2>

          <div>
            <input 
              placeholder="Student name"
              onChange={(e) => setStudentName(e.target.value)} 
            />
            <button onClick={addStudent}>Add</button>

            <input 
              placeholder="Course name"
              onChange={(e) => setCourseName(e.target.value)} 
            />
            <button onClick={addCourse}>Add</button>
          </div>

          <br />

          <div>
            <select onChange={(e) => setSelectedStudent(e.target.value)}>
              <option>Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

            <select onChange={(e) => setSelectedCourse(e.target.value)}>
              <option>Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>

            <button onClick={enroll}>Enroll</button>
            <button onClick={unenroll}>Unenroll</button>
          </div>

          <h3>Students</h3>
          <div className="list">
            {students.map(s => (
              <div className="list-item" key={s._id}>
                <span>
                  {s.name} → {s.courses.map(c => c.title).join(", ")}
                </span>
                <button onClick={() => deleteStudent(s._id)}>Delete</button>
              </div>
            ))}
          </div>

          <h3>Courses</h3>
          <div className="list">
            {courses.map(c => (
              <div className="list-item" key={c._id}>
                <span>
                  {c.title} → {c.students.map(s => s.name).join(", ")}
                </span>
                <button onClick={() => deleteCourse(c._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;