import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Certificate.css";

const cleanCourseName = (name, description) => {
  if (description) {
    const parts = description.split(/\s+content\s+for\s+/i);
    if (parts.length > 1) {
      let trackName = parts[1].trim();
      if (trackName.toLowerCase().includes("communication")) return "Communication";
      if (trackName.toLowerCase().includes("soft skills")) return "Soft Skills";
      if (trackName.toLowerCase().includes("data science")) return "Data Science";
      if (trackName.toLowerCase().includes("aptitude")) return "Aptitude Training";
      if (trackName.toLowerCase().includes("express")) return "Express.js";
      if (trackName.toLowerCase().includes("mongodb")) return "MongoDB";
      if (trackName.toLowerCase().includes("personality")) return "Personality Development";
      if (trackName.toLowerCase().includes("interview")) return "Interview Preparation";
      if (trackName.toLowerCase().includes("cyber")) return "Cyber Security";
      if (trackName.toLowerCase().includes("cloud")) return "Cloud Computing";
      if (trackName.toLowerCase().includes("ai track")) return "AI Track";
      return trackName;
    }
  }
  if (name === "Tutorials" || name === "Videos" || name === "Assignments" || name === "Quizzes" || name === "Projects") {
    if (description && description.includes("HTML")) return "HTML";
    if (description && description.includes("CSS")) return "CSS";
    if (description && description.includes("JavaScript")) return "JavaScript";
    if (description && description.includes("React")) return "React";
    if (description && description.includes("Node")) return "Node.js";
  }
  return name || "";
};

const Certificate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { cert, course } = location.state || {};

  if (!cert || !course) {
    return (
      <div className="cert-error-page">
        <h3>No Certificate Context</h3>
        <p>Please select a certificate to view from your Profile page.</p>
        <button className="btn-back-profile" onClick={() => navigate("/profile")}>
          Go to Profile
        </button>
      </div>
    );
  }

  const issueDate = cert.createdAt
    ? new Date(cert.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const printCertificate = () => {
    window.print();
  };

  const displayName = (() => {
    let name = cert.studentFullName || cert.studentName || user?.name || "Shashank";
    if (name === "Student Learner") name = user?.name || "Shashank";
    if (name === "Perumalla Rohith" || name === "PERUMALLA ROHITH") name = "Shashank";
    return name;
  })();

  const courseName = cleanCourseName(
    course?.name || cert?.courseId?.name,
    course?.description || cert?.courseId?.description
  );

  return (
    <div className="certificate-page-container">
      <div className="cert-utility-bar">
        <button className="btn-back-profile" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <button className="btn-print-cert" onClick={printCertificate}>
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Certificate Canvas */}
      <div className="certificate-canvas-frame">
        {/* Bottom corner ornaments rendered via JS so they appear above the CSS ::before/::after */}
        <div className="certificate-inner-border">
          <span className="cert-corner-br">✦</span>
          <span className="cert-corner-bl">✦</span>

          {/* Top decorative rule */}
          <div className="cert-top-rule">
            <span />
            <em>✦</em>
            <span />
          </div>

          {/* Header */}
          <div className="certificate-header">
            <div className="cert-logo-container">L</div>
            <h1 className="cert-main-title">Certificate of Completion</h1>
            <p className="cert-subtitle">LernX Online Learning Platform</p>
          </div>

          {/* Gold divider */}
          <div className="cert-divider" />

          {/* Body */}
          <div className="certificate-body">
            <p className="cert-presented-txt">This credential is proudly awarded to</p>

            <h2 className="cert-user-name">{displayName}</h2>
            <div className="cert-name-underline" />

            {cert.collegeName && (
              <p className="cert-college-txt">
                of <strong>{cert.collegeName}</strong>
              </p>
            )}

            {cert.year && (
              <p className="cert-year-txt">
                Graduation Year: <strong>{cert.year}</strong>
              </p>
            )}

            <p className="cert-completion-statement">
              for successfully completing the curriculum and requirements for the learning course
            </p>

            <h3 className="cert-course-name">{courseName}</h3>

            {/* Badge below course name */}
            <div className="cert-course-badge">
              <div className="cert-course-badge-dot" />
              <span className="cert-course-badge-txt">Verified Achievement</span>
              <div className="cert-course-badge-dot" />
            </div>

            <p className="cert-congrats-text">
              An accomplishment of standard excellence demonstrating comprehensive conceptual
              understanding and hands-on laboratory application.
            </p>
          </div>

          {/* Footer divider */}
          <div className="cert-footer-divider" />

          {/* Footer */}
          <div className="certificate-footer">
            <div className="footer-sig-block">
              <div className="sig-line">LernX Registrar</div>
              <div className="sig-label">Authorized Signatory</div>
            </div>

            <div className="footer-seal-block">
              <div className="cert-gold-seal">
                <span className="seal-text">VERIFIED</span>
                <span className="seal-stars">★ ★ ★</span>
              </div>
            </div>

            <div className="footer-meta-block">
              <div className="meta-line">
                <span className="lbl">Issue Date</span>
                <span className="val">{issueDate}</span>
              </div>
              <div className="meta-line">
                <span className="lbl">Credential ID</span>
                <span className="val">{cert._id || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
