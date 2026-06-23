import React, { useEffect, useState } from "react";
import API from "../../Services/eventApi";
import { createDepartment, createCategory, createDomain, getDepartments, getCategories } from "../../api/hierarchyApi";
import { createModule } from "../../api/courseApi";
import { generateCourse } from "../../api/aiApi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");

  const [users, setUsers] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");

  const [showEditUser, setShowEditUser] = useState(false);
  const [editId, setEditId] = useState("");

  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const [activeTab, setActiveTab] = useState("users");
  
  // Hierarchy state
  const [hierarchyForm, setHierarchyForm] = useState({ type: "department", name: "", description: "", parentId: "" });
  const [departmentsList, setDepartmentsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // Module state
  const [moduleForm, setModuleForm] = useState({ courseId: "", name: "", order: 1, notes: "" });
  
  // AI Course State
  const [aiCourseForm, setAiCourseForm] = useState({ courseName: "", domain: "" });
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addLog = (message) => {
    setTerminalLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin-login";
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      
      const usersData = Array.isArray(res.data)
        ? res.data
        : res.data.users || res.data.data || [];
  
      setUsers(usersData);
      addLog("Successfully connected to User Database.");
    } catch (error) {
      console.error(error);
      addLog("ERROR: Failed to fetch users from database.");
    }
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user._id !== id));
    alert("User removed from dashboard (Frontend only)");
  };

  const deleteByName = () => {
    const matchedUser = users.find(
      (user) => user.name && user.name.toLowerCase().includes(deleteName.trim().toLowerCase())
    );
    if (!matchedUser) {
      alert("User Not Found in the list.");
      return;
    }
    setUsers((prev) => prev.filter((user) => user._id !== matchedUser._id));
    alert(`User ${matchedUser.name} removed from dashboard`);
    setDeleteName("");
  };

  const deleteByEmail = () => {
    const matchedUser = users.find(
      (user) => user.email && user.email.toLowerCase() === deleteEmail.trim().toLowerCase()
    );
    if (!matchedUser) {
      alert("Email Not Found in the list.");
      return;
    }
    setUsers((prev) => prev.filter((user) => user._id !== matchedUser._id));
    alert(`User ${matchedUser.email} removed from dashboard`);
    setDeleteEmail("");
  };

  const logoutAdmin = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/users", { name, email, registerNumber });
      
      addLog("USER CREATED SUCCESSFULLY");
      addLog(`NAME: ${name} | EMAIL: ${email} | REG: ${registerNumber}`);
      addLog("Temporary password sent to user email");
      addLog("--------------------------------");
      
      alert("User Created Successfully");
      setName("");
      setEmail("");
      setRegisterNumber("");
      setShowCreateUser(false);
      
      fetchUsers();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "User Creation Failed";
      addLog(`ERROR: ${errorMsg}`);
      alert(errorMsg);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/users/${editId}`, { name, registerNumber });
      
      addLog("USER UPDATED SUCCESSFULLY");
      addLog(`ID: ${editId} | NAME: ${name} | REG: ${registerNumber}`);
      addLog("--------------------------------");
      
      alert("User Updated Successfully");
      setName("");
      setRegisterNumber("");
      setEditId("");
      setShowEditUser(false);
      
      fetchUsers();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "User Update Failed";
      addLog(`ERROR: ${errorMsg}`);
      alert(errorMsg);
    }
  };

  const loadHierarchyData = async () => {
    try {
      const deps = await getDepartments();
      setDepartmentsList(deps || []);
    } catch (e) { console.error(e); }
  };

  const handleHierarchyTypeChange = async (e) => {
    const type = e.target.value;
    setHierarchyForm({ ...hierarchyForm, type, parentId: "" });
    if (type === "category" || type === "domain") {
      await loadHierarchyData();
    }
  };

  const handleDepartmentSelect = async (e) => {
    const depId = e.target.value;
    setHierarchyForm({ ...hierarchyForm, parentId: depId });
    if (hierarchyForm.type === "domain" && depId) {
      try {
        const cats = await getCategories(depId);
        setCategoriesList(cats || []);
      } catch (err) { console.error(err); }
    }
  };

  const submitHierarchy = async (e) => {
    e.preventDefault();
    try {
      if (hierarchyForm.type === "department") {
        await createDepartment({ name: hierarchyForm.name, description: hierarchyForm.description });
      } else if (hierarchyForm.type === "category") {
        await createCategory({ name: hierarchyForm.name, description: hierarchyForm.description, departmentId: hierarchyForm.parentId });
      } else if (hierarchyForm.type === "domain") {
        await createDomain({ name: hierarchyForm.name, description: hierarchyForm.description, categoryId: hierarchyForm.parentId });
      }
      alert(`${hierarchyForm.type} created successfully`);
      setHierarchyForm({ ...hierarchyForm, name: "", description: "" });
    } catch (err) {
      alert("Failed to create " + hierarchyForm.type);
    }
  };

  const submitModule = async (e) => {
    e.preventDefault();
    try {
      await createModule(moduleForm);
      alert("Module created successfully");
      setModuleForm({ courseId: "", name: "", order: 1, notes: "" });
    } catch (err) {
      alert("Failed to create module");
    }
  };

  const submitAiCourse = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    addLog(`Initiating AI Course Generation for: ${aiCourseForm.courseName}...`);
    try {
      const res = await generateCourse(aiCourseForm);
      setGeneratedCourse(res.course || res.data || res);
      alert("Course generated successfully");
      addLog(`Success: Course ${aiCourseForm.courseName} generated`);
    } catch (err) {
      alert("Failed to generate course");
      addLog(`Error generating course: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🛡️</span>
          <h2>Admin Console</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab("users")}>Overview & Users</button>
          <button className="sidebar-link primary-action" onClick={() => setShowCreateUser(true)}><span>+</span> Create User</button>
          <button className={`sidebar-link ${activeTab === 'hierarchy' ? 'active' : ''}`} onClick={() => {setActiveTab("hierarchy"); loadHierarchyData();}}>Hierarchy Management</button>
          <button className={`sidebar-link ${activeTab === 'module' ? 'active' : ''}`} onClick={() => setActiveTab("module")}>Module Creation</button>
          <button className={`sidebar-link ${activeTab === 'aiCourse' ? 'active' : ''}`} onClick={() => setActiveTab("aiCourse")}>AI Course Generation</button>
          <button className="sidebar-link" onClick={() => window.open("/events", "_blank")}>Live Events</button>
          <button className={`sidebar-link ${showTerminal ? 'terminal-active' : ''}`} onClick={() => setShowTerminal(!showTerminal)}>System Logs</button>
        </nav>

        <button className="logout-btn" onClick={logoutAdmin}>
           Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header-container">
          <div className="header-titles">
            <h1>Administrative Management</h1>
            <p className="header-subtitle">Configure real-time server instances, monitor system configurations, and manage application nodes.</p>
          </div>
          <button className="wipe-all-btn" onClick={() => {
              if(window.confirm("Are you absolutely sure you want to clear all users from the current view?")) {
                  setUsers([]);
              }
          }}>
            Wipe Local View
          </button>
        </header>

        {/* SYSTEM LOGS TERMINAL */}
        {showTerminal && (
          <div className="terminal-view">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">system_logs.sh</span>
            </div>
            <div className="terminal-box">
              {terminalLogs.length > 0 ? (
                terminalLogs.map((log, i) => <p key={i} className="terminal-line">{log}</p>)
              ) : (
                <p className="terminal-placeholder">⚡ Idle. Waiting for system events...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <>
            <section className="admin-tools-container">
              <div className="admin-tool-card">
                <div className="tool-card-header">
                  <h3>Target System Deletion</h3>
                  <p>Purge specific record structures via unique username credentials.</p>
                </div>
                <div className="tool-input-group">
                  <input
                    type="text"
                    placeholder="Enter exact full name"
                    value={deleteName}
                    onChange={(e) => setDeleteName(e.target.value)}
                  />
                  <button onClick={deleteByName} className="tool-btn-danger">Delete Account</button>
                </div>
              </div>

              <div className="admin-tool-card">
                <div className="tool-card-header">
                  <h3>Target Network Deletion</h3>
                  <p>Purge registered structural nodes using designated email channels.</p>
                </div>
                <div className="tool-input-group">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                  />
                  <button onClick={deleteByEmail} className="tool-btn-danger">Delete Account</button>
                </div>
              </div>
            </section>

            <section className="users-section-wrapper">
              <div className="section-header">
                <h2>System Accounts</h2>
                <span className="counter-badge">{users.length} Active Nodes</span>
              </div>

              <div className="cards-grid" id="users-section">
                {users.length > 0 ? (
                  users.map((item, index) => (
                    <div className="user-card" key={item._id || index}>
                      <div className="user-card-top">
                        <div className="avatar-container">
                          <div className="profile-avatar">👤</div>
                          <div>
                            <h3 className="user-card-name">{item.name || item.studentName || "Anonymous Node"}</h3>
                            <span className="user-card-id">ID: {item._id ? item._id.slice(-8) : "N/A"}</span>
                          </div>
                        </div>
                        <span className={`status-badge ${item.isVerified ? "verified" : "pending"}`}>
                          {item.isVerified ? "Verified" : "Pending"}
                        </span>
                      </div>
                      
                      <div className="user-card-body">
                        <div className="info-row">
                          <span className="info-label">Network Route</span>
                          <span className="info-value email-value">{item.email}</span>
                        </div>
                      </div>

                      <div className="user-card-footer">
                        <button className="card-delete-btn" onClick={() => {
                          setEditId(item._id);
                          setName(item.name || item.studentName || "");
                          setRegisterNumber(item.registerNumber || "");
                          setShowEditUser(true);
                        }} style={{marginRight: "10px", background: "rgba(0, 112, 243, 0.1)", color: "#0070f3", border: "1px solid rgba(0, 112, 243, 0.3)"}}>
                          Edit Account
                        </button>
                        <button className="card-delete-btn" onClick={() => deleteUser(item._id)}>
                          Terminate Registry Account
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <h3>No Account Structures Discovered</h3>
                    <p>The system index currently contains no active profiles. Create a new user structure to initialize data fields.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "hierarchy" && (
          <section className="admin-tools-container" style={{display: "block"}}>
            <div className="admin-tool-card" style={{width: "100%"}}>
              <div className="tool-card-header">
                <h3>Create Hierarchy Node</h3>
                <p>Add departments, categories, and domains to structure course content.</p>
              </div>
              <form onSubmit={submitHierarchy} style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px"}}>
                <select value={hierarchyForm.type} onChange={handleHierarchyTypeChange} style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}}>
                  <option value="department">Department</option>
                  <option value="category">Category</option>
                  <option value="domain">Domain</option>
                </select>
                
                {(hierarchyForm.type === "category" || hierarchyForm.type === "domain") && (
                  <select value={hierarchyForm.type === "category" ? hierarchyForm.parentId : hierarchyForm.departmentId} onChange={handleDepartmentSelect} style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} required>
                    <option value="">Select Department</option>
                    {departmentsList.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                )}

                {hierarchyForm.type === "domain" && (
                  <select value={hierarchyForm.parentId} onChange={e => setHierarchyForm({...hierarchyForm, parentId: e.target.value})} style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} required>
                    <option value="">Select Category</option>
                    {categoriesList.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                )}

                <input type="text" placeholder="Name" value={hierarchyForm.name} onChange={e => setHierarchyForm({...hierarchyForm, name: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} />
                <textarea placeholder="Description" value={hierarchyForm.description} onChange={e => setHierarchyForm({...hierarchyForm, description: e.target.value})} style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white", minHeight: "80px"}} />
                
                <button type="submit" className="create-btn">Create {hierarchyForm.type}</button>
              </form>
            </div>
          </section>
        )}

        {activeTab === "module" && (
          <section className="admin-tools-container" style={{display: "block"}}>
            <div className="admin-tool-card" style={{width: "100%"}}>
              <div className="tool-card-header">
                <h3>Create Module</h3>
                <p>Manually construct course modules with detailed notes and ordering.</p>
              </div>
              <form onSubmit={submitModule} style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px"}}>
                <input type="text" placeholder="Course ID" value={moduleForm.courseId} onChange={e => setModuleForm({...moduleForm, courseId: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} />
                <input type="text" placeholder="Module Name" value={moduleForm.name} onChange={e => setModuleForm({...moduleForm, name: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} />
                <input type="number" placeholder="Module Order" value={moduleForm.order} onChange={e => setModuleForm({...moduleForm, order: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} />
                <textarea placeholder="Module Notes" value={moduleForm.notes} onChange={e => setModuleForm({...moduleForm, notes: e.target.value})} style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white", minHeight: "100px"}} />
                <button type="submit" className="create-btn">Create Module</button>
              </form>
            </div>
          </section>
        )}

        {activeTab === "aiCourse" && (
          <section className="admin-tools-container" style={{display: "block"}}>
            <div className="admin-tool-card" style={{width: "100%"}}>
              <div className="tool-card-header">
                <h3>AI Course Generation</h3>
                <p>Provide a topic and let AI structure an entire course payload instantly.</p>
              </div>
              <form onSubmit={submitAiCourse} style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px"}}>
                <input type="text" placeholder="Course Name/Topic (e.g. Advanced Machine Learning)" value={aiCourseForm.courseName} onChange={e => setAiCourseForm({...aiCourseForm, courseName: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} />
                <input type="text" placeholder="Domain Area (e.g. Data Science)" value={aiCourseForm.domain} onChange={e => setAiCourseForm({...aiCourseForm, domain: e.target.value})} required style={{padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "white"}} />
                <button type="submit" className="create-btn" disabled={isGenerating}>
                  {isGenerating ? "Synthesizing AI Course..." : "Generate AI Course"}
                </button>
              </form>
            </div>
            
            {generatedCourse && (
              <div className="admin-tool-card" style={{width: "100%", marginTop: "20px", background: "#1a1a1a"}}>
                <div className="tool-card-header">
                  <h3 style={{color: "#4ade80"}}>Generation Successful</h3>
                  <p>Course: <strong>{generatedCourse.name}</strong></p>
                </div>
                <div style={{marginTop: "15px", maxHeight: "400px", overflowY: "auto", padding: "10px", background: "#0a0a0a", borderRadius: "5px"}}>
                  <pre style={{color: "#a3a3a3", fontSize: "0.85rem", margin: 0, whiteSpace: "pre-wrap"}}>
                    {JSON.stringify(generatedCourse, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* CREATE USER POPUP MODAL */}
      {showCreateUser && (
        <div className="popup-overlay">
          <div className="create-user-popup">
            <button className="popup-close" onClick={() => setShowCreateUser(false)}>🗙</button>
            <div className="popup-header">
              <h2 className="popup-title">Deploy User Node</h2>
              <p className="popup-subtitle">Provision an automated user credential architecture inside live operational clusters.</p>
            </div>
            
            <form onSubmit={createUser} className="popup-form">
              <div className="input-group">
                <label>Structural Identity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Wright"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Register Number</label>
                <input
                  type="text"
                  placeholder="e.g. REG-2026-001"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Target Domain Communication Endpoint</label>
                <input
                  type="email"
                  placeholder="e.g. alex@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="create-btn">Execute Deployment</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER POPUP MODAL */}
      {showEditUser && (
        <div className="popup-overlay">
          <div className="create-user-popup">
            <button className="popup-close" onClick={() => setShowEditUser(false)}>🗙</button>
            <div className="popup-header">
              <h2 className="popup-title">Modify User Node</h2>
              <p className="popup-subtitle">Update structural identity for selected node.</p>
            </div>
            
            <form onSubmit={updateUser} className="popup-form">
              <div className="input-group">
                <label>Structural Identity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Register Number</label>
                <input
                  type="text"
                  placeholder="e.g. REG-2026-002"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="create-btn">Execute Modification</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;