import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const API = "https://brillon-tasks-1.onrender.com/api/v1";

const UserDashboard = () => {
  const navigate = useNavigate();
  const cursorDotRef = useRef(null);
  const cursorGlowRef = useRef(null);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  // ─── Custom Cursor ───────────────────────────────────────────────────────────
  useEffect(() => {
    const dot = cursorDotRef.current;
    const glow = cursorGlowRef.current;
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
      }
    };

    const animateGlow = () => {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      if (glow) {
        glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
      }
      requestAnimationFrame(animateGlow);
    };

    document.addEventListener("mousemove", moveCursor);
    animateGlow();

    const handleClick = () => {
      if (dot) {
        dot.classList.add("cursor-click");
        setTimeout(() => dot.classList.remove("cursor-click"), 300);
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // ─── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(savedUser);
    if (savedUser) {
      setEditData({
        name: savedUser.name || "",
        email: savedUser.email || "",
        currentPassword: "",
        newPassword: "",
      });
    }
    fetchEnrollments();
    fetchCertificates();
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("userToken");

  // ─── API ─────────────────────────────────────────────────────────────────
  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`${API}/enrollments/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      console.log("DASHBOARD ENROLLMENTS", data);
      setEnrolledCourses(data.enrollments || data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API}/certificates/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setCertificates(data.certificates || data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/user/my-events`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setEvents(data.events || data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      if (editData.newPassword) {
        await fetch(`${API}/user/change-password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ newPassword: editData.newPassword }),
        });
      }
      const updated = { ...user, name: editData.name, email: editData.email };
      setUser(updated);
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      alert("Profile Updated");
      setEditMode(false);
    } catch (e) {
      alert("Update Failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/user-login");
  };

  const progressValue = (item) =>
    item.completionPercentage || item.progress || item.progressPercentage || 0;

  const courseId = (item) =>
    item.courseId?._id || item.course?._id || item.courseId;

  // ─── Sidebar nav items ────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "enrollments", icon: "📚", label: "My Courses" },
    { id: "certificates", icon: "🏆", label: "Certificates" },
    { id: "events", icon: "🎉", label: "Events" },
  ];

  const avatarInitial = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <div className="ud-root">
      {/* ── Custom Cursor ── */}
      <div ref={cursorDotRef} className="ud-cursor-dot" />
      <div ref={cursorGlowRef} className="ud-cursor-glow" />

      {/* ── Ambient blobs ── */}
      <div className="ud-blob ud-blob-1" />
      <div className="ud-blob ud-blob-2" />
      <div className="ud-blob ud-blob-3" />

      {/* ════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════ */}
      <aside className={`ud-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        {/* Brand */}
        <div className="ud-sidebar-brand">
          <div className="ud-brand-icon">
            <span>L</span>
          </div>
          {sidebarOpen && <span className="ud-brand-name">LernX</span>}
        </div>

        {/* Avatar */}
        <div className="ud-sidebar-profile">
          <div className="ud-avatar-ring">
            <div className="ud-avatar">{avatarInitial}</div>
          </div>
          {sidebarOpen && (
            <div className="ud-sidebar-user-info">
              <p className="ud-sidebar-name">{user?.name || "Student"}</p>
              <span className="ud-role-badge">✦ Student</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="ud-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`ud-nav-btn ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="ud-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="ud-nav-label">{item.label}</span>}
              {activeSection === item.id && <span className="ud-nav-indicator" />}
            </button>
          ))}

          <button
            className="ud-nav-btn"
            onClick={() => navigate("/courses")}
            title={!sidebarOpen ? "Browse Courses" : ""}
          >
            <span className="ud-nav-icon">🔭</span>
            {sidebarOpen && <span className="ud-nav-label">Browse Courses</span>}
          </button>
        </nav>

        {/* Collapse toggle */}
        <button
          className="ud-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "◂" : "▸"}
        </button>

        {/* Logout */}
        <button className="ud-logout-btn" onClick={logout}>
          <span>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════ */}
      <main className="ud-main">

        {/* ── TOP BAR ── */}
        <header className="ud-topbar">
          <div className="ud-topbar-left">
            <h2 className="ud-topbar-title">
              {navItems.find((n) => n.id === activeSection)?.label || "Browse Courses"}
            </h2>
            <p className="ud-topbar-sub">
              {activeSection === "dashboard" && `Welcome back, ${user?.name?.split(" ")[0] || "Student"} 👋`}
              {activeSection === "enrollments" && "Track your learning journey"}
              {activeSection === "certificates" && "Your achievements gallery"}
              {activeSection === "events" && "Registered workshops & events"}
            </p>
          </div>
          <div className="ud-topbar-right">
            <div className="ud-topbar-avatar">{avatarInitial}</div>
          </div>
        </header>

        {/* ════ DASHBOARD SECTION ════ */}
        {activeSection === "dashboard" && (
          <div className="ud-view ud-anim-in">

            {/* Stats grid */}
            <div className="ud-stats-grid">
              <div className="ud-stat-card ud-stat-purple">
                <div className="ud-stat-icon">📚</div>
                <div className="ud-stat-body">
                  <h3>{enrolledCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
                <div className="ud-stat-glow" />
              </div>
              <div className="ud-stat-card ud-stat-cyan">
                <div className="ud-stat-icon">🏆</div>
                <div className="ud-stat-body">
                  <h3>{certificates.length}</h3>
                  <p>Certificates Earned</p>
                </div>
                <div className="ud-stat-glow" />
              </div>
              <div className="ud-stat-card ud-stat-pink">
                <div className="ud-stat-icon">🎉</div>
                <div className="ud-stat-body">
                  <h3>{events.length}</h3>
                  <p>Events Joined</p>
                </div>
                <div className="ud-stat-glow" />
              </div>
            </div>

            {/* Profile + Recent courses row */}
            <div className="ud-panel-row">

              {/* Profile panel */}
              <div className="ud-glass-card ud-profile-panel">
                <div className="ud-panel-heading">
                  <span className="ud-panel-icon">👤</span>
                  <h3>Profile</h3>
                </div>

                {!editMode ? (
                  <>
                    <div className="ud-profile-avatar-lg">
                      {avatarInitial}
                    </div>
                    <h4 className="ud-profile-name">{user?.name}</h4>
                    <p className="ud-profile-email">{user?.email}</p>
                    <span className="ud-role-badge" style={{ margin: "12px auto" }}>✦ Student</span>
                    <button
                      className="ud-btn-primary"
                      onClick={() => setEditMode(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="ud-edit-form">
                    <div className="ud-field-group">
                      <label>Name</label>
                      <input
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="ud-field-group">
                      <label>Email</label>
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                      />
                    </div>
                    <div className="ud-field-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        placeholder="Leave blank to keep"
                        name="newPassword"
                        value={editData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ud-form-actions">
                      <button className="ud-btn-primary" onClick={saveProfile}>💾 Save</button>
                      <button className="ud-btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent courses */}
              <div className="ud-glass-card ud-recent-panel">
                <div className="ud-panel-heading">
                  <span className="ud-panel-icon">🚀</span>
                  <h3>Recent Courses</h3>
                </div>
                <div className="ud-recent-list">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.slice(0, 4).map((item) => {
                      const pct = progressValue(item);
                      const isComplete = pct >= 100;
                      return (
                        <div key={item._id} className={`ud-recent-row ${isComplete ? "ud-complete" : ""}`}>
                          <div className="ud-recent-info">
                            <span className="ud-recent-dot">
                              {isComplete ? "✅" : "📘"}
                            </span>
                            <div>
                              <p className="ud-recent-title">
                                {item.courseId?.name || item.courseId?.title || item.course?.name || "Course"}
                              </p>
                              <div className="ud-mini-progress-track">
                                <div
                                  className={`ud-mini-progress-fill ${isComplete ? "ud-fill-complete" : ""}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <span className={`ud-pct-badge ${isComplete ? "ud-pct-done" : ""}`}>
                            {isComplete ? "🎓 Done" : `${pct}%`}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="ud-empty-state">
                      <p>🌱 No courses yet. Start learning!</p>
                      <button className="ud-btn-primary" onClick={() => navigate("/courses")}>
                        Browse Courses
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ ENROLLMENTS SECTION ════ */}
        {activeSection === "enrollments" && (
          <div className="ud-view ud-anim-in">
            <div className="ud-cards-grid">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((item) => {
                  const pct = progressValue(item);
                  const isComplete = pct >= 100;
                  return (
                    <div
                      key={item._id}
                      className={`ud-course-card ${isComplete ? "ud-course-complete" : ""}`}
                    >
                      {isComplete && (
                        <div className="ud-complete-ribbon">
                          🎓 Completed!
                        </div>
                      )}
                      <div className="ud-course-card-header">
                        <div className={`ud-course-icon-wrap ${isComplete ? "ud-icon-gold" : ""}`}>
                          {isComplete ? "🏅" : "📘"}
                        </div>
                        <div className="ud-course-meta">
                          <h3>
                            {item.courseId?.name ||
                              item.courseId?.title ||
                              item.course?.name ||
                              "Course"}
                          </h3>
                          <p>
                            {item.courseId?.description || "Continue your learning journey"}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="ud-progress-section">
                        <div className="ud-progress-label-row">
                          <span>Progress</span>
                          <strong className={isComplete ? "ud-text-gold" : ""}>{pct}%</strong>
                        </div>
                        <div className="ud-progress-track">
                          <div
                            className={`ud-progress-fill ${isComplete ? "ud-progress-gold" : ""}`}
                            style={{ width: `${pct}%` }}
                          />
                          {isComplete && (
                            <div className="ud-progress-sparkle">✨</div>
                          )}
                        </div>
                      </div>

                      {isComplete ? (
                        <div className="ud-complete-message">
                          🌟 You've mastered this course!
                        </div>
                      ) : (
                        <button
                          className="ud-btn-primary ud-btn-full"
                          onClick={() => navigate(`/player/${courseId(item)}`)}
                        >
                          Continue Learning →
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="ud-empty-full">
                  <div className="ud-empty-icon">🎓</div>
                  <h3>No courses enrolled yet</h3>
                  <p>Start your learning journey today</p>
                  <button className="ud-btn-primary" onClick={() => navigate("/courses")}>
                    Explore Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ CERTIFICATES SECTION ════ */}
        {activeSection === "certificates" && (
          <div className="ud-view ud-anim-in">
            <p className="ud-section-sub">Your verified achievements from completed courses</p>
            <div className="ud-cert-grid">
              {certificates.length > 0 ? (
                certificates.map((cert) => (
                  <div key={cert._id} className="ud-cert-card">
                    <div className="ud-cert-glow-border" />
                    <div className="ud-cert-header">
                      <div className="ud-cert-icon-wrap">🏆</div>
                      <div>
                        <h4>Certificate of Completion</h4>
                        <span className="ud-verified-badge">✔ Verified Achievement</span>
                      </div>
                    </div>
                    <div className="ud-cert-body">
                      <h3>
                        {cert.courseId?.name ||
                          cert.courseId?.title ||
                          cert.course?.name ||
                          "Course"}
                      </h3>
                      <p>Completed successfully with LernX</p>
                    </div>
                    <div className="ud-cert-info-row">
                      <span>📅 Issued</span>
                      <strong>
                        {cert.createdAt
                          ? new Date(cert.createdAt).toLocaleDateString()
                          : "Recently"}
                      </strong>
                    </div>
                    <div className="ud-cert-actions">
                      {cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ud-btn-cert-view"
                        >
                          👁 View
                        </a>
                      )}
                      {cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          download
                          className="ud-btn-cert-dl"
                        >
                          ⬇ Download
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="ud-empty-full">
                  <div className="ud-empty-icon">🏆</div>
                  <h3>No certificates yet</h3>
                  <p>Complete courses to earn your certificates</p>
                  <button className="ud-btn-primary" onClick={() => navigate("/courses")}>
                    Start Learning
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ EVENTS SECTION ════ */}
        {activeSection === "events" && (
          <div className="ud-view ud-anim-in">
            <div className="ud-cards-grid">
              {events.length > 0 ? (
                events.map((e) => (
                  <div key={e._id} className="ud-event-card">
                    <div className="ud-event-icon">🎉</div>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                  </div>
                ))
              ) : (
                <div className="ud-empty-full">
                  <div className="ud-empty-icon">🎪</div>
                  <h3>No events registered</h3>
                  <p>Check out upcoming workshops and events</p>
                  <button className="ud-btn-primary" onClick={() => navigate("/events")}>
                    Browse Events
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;