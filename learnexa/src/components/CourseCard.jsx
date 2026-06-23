import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import "./CourseCard.css";

const CourseCard = ({ course, enrollment, onEnroll }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isEnrolled = !!enrollment;
  const progress = enrollment ? enrollment.progress || 0 : 0;

  const handleButtonClick = async (e) => {
    e.stopPropagation(); // Avoid navigating to details page
    if (isEnrolled) {
      navigate(`/player/${course._id}`);
    } else {
      setLoading(true);
      try {
        await onEnroll(course._id);
      } catch (err) {
        console.error("Failed to enroll", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getDifficultyColor = (difficulty = "Intermediate") => {
    const d = difficulty.toLowerCase();
    if (d.includes("begin")) return "difficulty-beginner";
    if (d.includes("adv")) return "difficulty-advanced";
    return "difficulty-intermediate";
  };

  const getGradient = (id) => {
    // Generate a beautiful distinct gradient based on course ID
    const colors = [
      "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    ];
    const index = id ? id.charCodeAt(id.length - 1) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="course-card" onClick={() => navigate(`/course/${course._id}`)}>
      <div className="course-card-banner" style={{ background: getGradient(course._id) }}>
        <span className={`difficulty-badge ${getDifficultyColor(course.difficulty)}`}>
          {course.difficulty || "Intermediate"}
        </span>
        <div className="banner-overlay">
          <span className="course-status">{course.status || "Active"}</span>
        </div>
      </div>

      <div className="course-card-body">
        <h4 className="course-card-title">{course.name}</h4>
        <p className="course-card-description">
          {course.description || "Learn industry standard skills with this comprehensive course."}
        </p>

        <div className="course-card-meta">
          <div className="meta-item">
            <span className="meta-label">Instructor:</span>
            <span className="meta-value">{course.instructor || "LernX Expert"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Duration:</span>
            <span className="meta-value">{course.duration || "Self-paced"}</span>
          </div>
        </div>

        {isEnrolled && progress > 0 && (
          <div className="course-card-progress">
            <div className="progress-label-row">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>

      <div className="course-card-footer">
        <button
          className={`btn-course-action ${isEnrolled ? "enrolled" : "unenrolled"} ${loading ? "loading" : ""}`}
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="btn-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span>Enrolling...</span>
            </>
          ) : isEnrolled ? (
            <>
              <span>Continue Learning</span>
              <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </>
          ) : (
            <span>Start Learning</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
