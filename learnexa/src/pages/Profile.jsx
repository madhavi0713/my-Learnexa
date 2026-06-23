import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getMyEnrollments } from "../api/enrollmentApi";
import { getMyEvents } from "../api/authApi";
import { getMyCertificates } from "../api/certificateApi";
import { getModules } from "../api/courseApi";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

/* ─── course name cleaner ─────────────────────────────────────────── */
const cleanCourseName = (name, description) => {
  if (name === "HTML Complete Tutorial") return "HTML";
  if (description) {
    const parts = description.split(/\s+content\s+for\s+/i);
    if (parts.length > 1) {
      const t = parts[1].trim().toLowerCase();
      if (t.includes("communication"))  return "Communication";
      if (t.includes("soft skills"))    return "Soft Skills";
      if (t.includes("data science"))   return "Data Science";
      if (t.includes("aptitude"))       return "Aptitude Training";
      if (t.includes("express"))        return "Express.js";
      if (t.includes("mongodb"))        return "MongoDB";
      if (t.includes("personality"))    return "Personality Development";
      if (t.includes("interview"))      return "Interview Preparation";
      if (t.includes("cyber"))          return "Cyber Security";
      if (t.includes("cloud"))          return "Cloud Computing";
      if (t.includes("ai track"))       return "AI Track";
      return parts[1].trim();
    }
  }
  if (["Tutorials","Videos","Assignments","Quizzes","Projects"].includes(name)) {
    if (description?.includes("HTML"))       return "HTML";
    if (description?.includes("CSS"))        return "CSS";
    if (description?.includes("JavaScript")) return "JavaScript";
    if (description?.includes("React"))      return "React";
    if (description?.includes("Node"))       return "Node.js";
  }
  return name || "";
};

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, updatePassword, certificates, setCertificates } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [enrollments,       setEnrollments]       = useState([]);
  const [events,            setEvents]            = useState([]);
  const [newPassword,       setNewPassword]       = useState("");
  const [confirmPassword,   setConfirmPassword]   = useState("");
  const [submittingPassword,setSubmittingPassword]= useState(false);
  const [loading,           setLoading]           = useState(true);

  /* ── CURSOR — elements live on document.body, never clipped ──── */
  useEffect(() => {
    /* Create dot */
    const dot = document.createElement("div");
    dot.className = "p-cursor-dot";
    document.body.appendChild(dot);

    /* Create glow */
    const glow = document.createElement("div");
    glow.className = "p-cursor-glow";
    document.body.appendChild(glow);

    /* Hide native cursor for the whole page */
    document.documentElement.classList.add("profile-active");

    let mx = 0, my = 0;
    let gx = 0, gy = 0;
    let rafId;

    /* Snap dot immediately */
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.setProperty("--x", `${mx}px`);
      dot.style.setProperty("--y", `${my}px`);
    };

    /* Smoothly lerp the glow */
    const tick = () => {
      gx += (mx - gx) * 0.09;
      gy += (my - gy) * 0.09;
      glow.style.setProperty("--gx", `${gx}px`);
      glow.style.setProperty("--gy", `${gy}px`);
      rafId = requestAnimationFrame(tick);
    };

    /* Click burst */
    const onClick = () => {
      dot.classList.add("burst");
      setTimeout(() => dot.classList.remove("burst"), 300);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("click",     onClick);
    rafId = requestAnimationFrame(tick);

    /* Cleanup on unmount */
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click",     onClick);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("profile-active");
      dot.remove();
      glow.remove();
    };
  }, []);

  /* ── Auth guard ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!localStorage.getItem("token") && !localStorage.getItem("userToken")) {
      navigate("/user-login");
      return;
    }
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Data fetching ───────────────────────────────────────────── */
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const activeEnrollments = await getMyEnrollments();

      /* de-duplicate by course name, keep highest progress */
      const map = new Map();
      activeEnrollments.forEach((enroll) => {
        const cd = enroll.courseId;
        if (!cd) return;
        const cName =
          enroll.course?.title ||
          enroll.course?.name  ||
          cleanCourseName(
            cd.name || cd.title || (typeof cd === "string" ? cd : ""),
            cd.description
          );
        if (!cName) return;

        const existing = map.get(cName);
        if (!existing) {
          map.set(cName, enroll);
        } else {
          const ep = existing.progress ?? existing.progressPercentage ?? 0;
          const cp = enroll.progress   ?? enroll.progressPercentage   ?? 0;
          const et = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
          const ct = new Date(enroll.updatedAt   || enroll.createdAt   || 0).getTime();
          if (cp > ep || (cp === ep && ct > et)) map.set(cName, enroll);
        }
      });

      /* Enrich with module info */
      const enriched = await Promise.all(
        Array.from(map.values()).map(async (enroll) => {
          const cd = enroll.courseId;
          if (!cd) return enroll;
          const cId = cd._id || cd;
          try {
            const modules = await getModules(cId);
            return { ...enroll, hasModules: modules?.length > 0 };
          } catch {
            return { ...enroll, hasModules: false };
          }
        })
      );
      setEnrollments(enriched);

      const myEvents = await getMyEvents();
      setEvents(Array.isArray(myEvents) ? myEvents : []);

      const certs = await getMyCertificates();
      setCertificates(Array.isArray(certs) ? certs : []);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Password change ─────────────────────────────────────────── */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim())          { alert("Password cannot be empty.");   return; }
    if (newPassword !== confirmPassword){ alert("Passwords do not match.");    return; }
    setSubmittingPassword(true);
    try {
      await updatePassword(newPassword);
      alert("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.message || "Failed to update password.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────── */
  const avatarChar = user?.name
    ? user.name[0].toUpperCase()
    : user?.email ? user.email[0].toUpperCase() : "U";

  const idStr = (v) => (typeof v === "object" ? v?._id : v)?.toString() ?? "";

  const certForCourse = (courseIdRaw) => {
    if (!certificates?.length || !courseIdRaw) return null;
    const target = idStr(courseIdRaw);
    return (
      certificates.find((c) => idStr(c.courseId) === target) ||
      certificates.find((c) => idStr(c.course)   === target) ||
      null
    );
  };

  const completedCount = enrollments.filter(
    (e) => (e.progress ?? e.progressPercentage ?? 0) >= 100
  ).length;

  /* ── Loading screen ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="profile-loading-viewport">
        <div className="spinner-large" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="profile-page-wrapper">

      {/* Ambient blobs */}
      <div className="p-blob p-blob-1" />
      <div className="p-blob p-blob-2" />
      <div className="p-blob p-blob-3" />

      {/* ════ HERO BANNER ════ */}
      <div className="p-hero-banner">
        <div className="p-hero-avatar-wrap">
          <div className="p-hero-avatar-ring">
            <div className="p-hero-avatar">{avatarChar}</div>
          </div>
          <div className="p-online-dot" />
        </div>

        <div className="p-hero-info">
          <h2>{user?.name || "Student"}</h2>
          <p className="p-hero-email">{user?.email}</p>
          <div className="p-hero-badges">
            <span className="p-badge p-badge-role">✦ {user?.role || "Student"}</span>
            <span className="p-badge p-badge-active">● Active</span>
          </div>
        </div>
      </div>

      {/* ════ MAIN GRID ════ */}
      <div className="p-main-grid">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="p-sidebar">

          {/* Mini stats */}
          <div className="p-mini-stats">
            <div className="p-mini-stat">
              <div className="p-mini-stat-icon">📚</div>
              <div className="p-mini-stat-val">{enrollments.length}</div>
              <div className="p-mini-stat-lbl">Courses</div>
            </div>
            <div className="p-mini-stat">
              <div className="p-mini-stat-icon">🏆</div>
              <div className="p-mini-stat-val">{certificates?.length ?? 0}</div>
              <div className="p-mini-stat-lbl">Certs</div>
            </div>
            <div className="p-mini-stat">
              <div className="p-mini-stat-icon">✅</div>
              <div className="p-mini-stat-val">{completedCount}</div>
              <div className="p-mini-stat-lbl">Done</div>
            </div>
            <div className="p-mini-stat">
              <div className="p-mini-stat-icon">🎉</div>
              <div className="p-mini-stat-val">{events.length}</div>
              <div className="p-mini-stat-lbl">Events</div>
            </div>
          </div>

          {/* Password card */}
          <div className="p-glass">
            <p className="p-card-title">
              <span className="p-card-title-icon">🔒</span>
              Update Password
            </p>
            <form onSubmit={handleChangePassword}>
              <div className="p-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="p-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="p-btn-primary"
                disabled={submittingPassword}
              >
                {submittingPassword ? "Saving…" : "💾 Change Password"}
              </button>
            </form>

            <button onClick={toggleTheme} className="p-theme-btn">
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

        </aside>

        {/* ── RIGHT COLUMN ── */}
        <main className="p-right-col">

          {/* ── Enrollments ── */}
          <div className="p-glass">
            <div className="p-section-head">
              <h3><span>📚</span> Enrolled Learning Pathways</h3>
              <span className="p-count-pill">{enrollments.length}</span>
            </div>

            {enrollments.length === 0 ? (
              <div className="p-empty">
                <div className="p-empty-icon">🌱</div>
                <p>You haven't enrolled in any courses yet.</p>
                <button className="p-btn-browse" onClick={() => navigate("/courses")}>
                  Browse Catalogue
                </button>
              </div>
            ) : (
              <div className="p-enrollment-list">
                {enrollments.map((enroll) => {
                  const cd = enroll.courseId;
                  if (!cd) return null;

                  const courseIdVal = cd._id || cd;
                  const progressVal = enroll.progress ?? 0;
                  const isComplete  = progressVal >= 100;
                  const matchedCert = isComplete ? certForCourse(courseIdVal) : null;

                  const courseName =
                    enroll.course?.title ||
                    enroll.course?.name  ||
                    cleanCourseName(cd.name || cd.title || "", cd.description);

                  return (
                    <div
                      key={enroll._id}
                      className={`p-enroll-card ${isComplete ? "is-complete" : ""}`}
                    >
                      {/* Icon */}
                      <div className={`p-enroll-icon ${isComplete ? "gold-icon" : ""}`}>
                        {isComplete ? "🏅" : "📘"}
                      </div>

                      {/* Info */}
                      <div className="p-enroll-info">
                        <div className="p-enroll-name">{courseName}</div>
                        <div className="p-enroll-meta">
                          Instructor: {cd.instructor || "LernX Team"}
                        </div>
                        {isComplete && (
                          <span className="p-complete-chip">🎓 Completed</span>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="p-enroll-progress">
                        <div className="p-prog-label-row">
                          <span>Progress</span>
                          <strong className={isComplete ? "gold-val" : ""}>
                            {progressVal}%
                          </strong>
                        </div>
                        <div className="p-prog-track">
                          <div
                            className={`p-prog-fill ${isComplete ? "gold-fill" : ""}`}
                            style={{ width: `${progressVal}%` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-enroll-actions">
                        {isComplete ? (
                          /* 100% done → show cert buttons, hide Continue */
                          <div className="p-cert-actions">
                            <button
                              className="p-btn-view-cert"
                              onClick={() =>
                                navigate("/certificate/preview", {
                                  state: {
                                    cert: matchedCert,
                                    course: {
                                      ...cd,
                                      name: cleanCourseName(cd.name, cd.description),
                                    },
                                  },
                                })
                              }
                            >
                              🏆 View Cert
                            </button>

                            {matchedCert?.certificateUrl ? (
                              <a
                                href={matchedCert.certificateUrl}
                                download
                                className="p-btn-dl-cert"
                              >
                                ⬇ Download
                              </a>
                            ) : (
                              <button
                                className="p-btn-dl-cert"
                                onClick={() =>
                                  navigate("/certificate/preview", {
                                    state: {
                                      cert: matchedCert,
                                      course: {
                                        ...cd,
                                        name: cleanCourseName(cd.name, cd.description),
                                      },
                                    },
                                  })
                                }
                              >
                                ⬇ Download
                              </button>
                            )}
                          </div>
                        ) : (
                          /* In-progress → Continue button */
                          <button
                            className="p-btn-continue"
                            onClick={() =>
                              navigate(
                                enroll.hasModules
                                  ? `/player/${courseIdVal}`
                                  : `/course/${courseIdVal}`
                              )
                            }
                          >
                            Continue →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Certificates ── */}
          <div className="p-glass">
            <div className="p-section-head">
              <h3><span>🏆</span> My Digital Credentials</h3>
              <span className="p-count-pill">{certificates?.length ?? 0}</span>
            </div>

            {!certificates?.length ? (
              <div className="p-empty">
                <div className="p-empty-icon">🎖️</div>
                <p>Earned certificates appear here once you reach 100% progress.</p>
              </div>
            ) : (
              <div className="p-cert-grid">
                {certificates.map((cert) => {
                  const cd = cert.courseId;
                  if (!cd) return null;
                  return (
                    <div className="p-cert-card" key={cert._id}>
                      <div className="p-cert-icon">🏆</div>
                      <div className="p-cert-name">
                        {cleanCourseName(cd.name, cd.description)}
                      </div>
                      <div className="p-cert-date">
                        Issued:{" "}
                        {cert.createdAt
                          ? new Date(cert.createdAt).toLocaleDateString()
                          : "Recently"}
                      </div>
                      <button
                        className="p-btn-cert-dl"
                        onClick={() =>
                          navigate("/certificate/preview", {
                            state: {
                              cert,
                              course: {
                                ...cd,
                                name: cleanCourseName(cd.name, cd.description),
                              },
                            },
                          })
                        }
                      >
                        Download Certificate
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Events ── */}
          <div className="p-glass">
            <div className="p-section-head">
              <h3><span>🎉</span> Registered Workshops</h3>
              <span className="p-count-pill">{events.length}</span>
            </div>

            {events.length === 0 ? (
              <div className="p-empty">
                <div className="p-empty-icon">📅</div>
                <p>You haven't registered for any events yet.</p>
                <button className="p-btn-browse" onClick={() => navigate("/events")}>
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="p-event-list">
                {events.map((regEvt) => {
                  const ev = regEvt.eventId || regEvt;
                  if (!ev?.name) return null;
                  const cat = ev.category?.toLowerCase();
                  const pillClass = cat === "it" ? "it" : cat ? "non-it" : "general";
                  return (
                    <div className="p-event-row" key={regEvt._id}>
                      <div className="p-event-dot" />
                      <div className="p-event-info">
                        <h4>{ev.name}</h4>
                        <div className="p-event-meta">
                          <span>📅 {ev.date ? new Date(ev.date).toLocaleDateString() : "TBA"}</span>
                          <span>📍 {ev.location || "Online"}</span>
                        </div>
                      </div>
                      <span className={`p-event-pill ${pillClass}`}>
                        {ev.category || "General"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Profile;
