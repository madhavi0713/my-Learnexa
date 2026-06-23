import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseDetails, getModules, getSubModules } from "../api/courseApi";
import { getMyEnrollments, enrollInCourse } from "../api/enrollmentApi";
import { generateCertificate, getMyCertificates } from "../api/certificateApi";
import ProgressBar from "../components/ProgressBar";
import { normalizeArray } from "../utils/normalizeArray";
import "./CourseDetails.css";

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

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]); // Array of modules with submodules
  const [enrollment, setEnrollment] = useState(null);
  const [hasCertificate, setHasCertificate] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Course details
      const courseData = await getCourseDetails(id);
      if (!courseData) {
        setError("Course not found.");
        setLoading(false);
        return;
      }
      setCourse(courseData);

      // 2. Fetch enrollment status
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === id || e.courseId === id);
      setEnrollment(currentEnroll || null);

      // 3. Fetch certificates if complete
      if (currentEnroll && currentEnroll.progress === 100) {
        const certs = await getMyCertificates();
        const earned = certs.some((c) => c.courseId?._id === id || c.courseId === id);
        setHasCertificate(earned);
      }

      // 4. Fetch Modules & Submodules for Syllabus Outline
      const modulesData = await getModules(id);
      const syllabusOutline = await Promise.all(
        normalizeArray(modulesData).map(async (mod) => {
          const subs = await getSubModules(mod._id);
          return { ...mod, subModules: subs };
        })
      );
      setSyllabus(syllabusOutline);
    } catch (err) {
      console.error("Error loading course details page", err);
      setError("Failed to load course details. Please verify your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setLoadingAction(true);
    try {
      await enrollInCourse(id);
      // Refresh enrollments
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === id || e.courseId === id);
      setEnrollment(currentEnroll);
    } catch (err) {
      alert(err.response?.data?.error || "Please log in to start learning this course.");
      navigate("/user-login");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setLoadingCertificate(true);
    try {
      await generateCertificate(id);
      setHasCertificate(true);
      alert("Certificate generated successfully! You can view it in your Profile.");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate certificate.");
    } finally {
      setLoadingCertificate(false);
    }
  };

  if (loading) {
    return (
      <div className="course-details-loading">
        <div className="spinner-large"></div>
        <p>Assembling course materials...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-details-error">
        <h2>Oops! Page Loading Failed</h2>
        <p>{error || "Course information could not be retrieved."}</p>
        <button onClick={() => navigate("/courses")} className="btn-back">
          Back to Catalogue
        </button>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const progress = enrollment ? enrollment.progress || 0 : 0;

  return (
    <div className="course-details-page">
      {/* Top Section: Purple Gradient Banner */}
      <section className="purple-hero-banner">
        <div className="banner-content-container">
          <button className="btn-details-back" onClick={() => navigate("/courses")}>
            ← Back to Courses
          </button>
          <span className="banner-badge">{course.difficulty || "Intermediate"}</span>
          <h1 className="banner-title">{cleanCourseName(course.name, course.description)}</h1>
          <div className="banner-meta-row">
            <div className="meta-block">
              <span className="block-label">Instructor</span>
              <span className="block-value">{course.instructor || "LernX Professional"}</span>
            </div>
            <div className="meta-block">
              <span className="block-label">Duration</span>
              <span className="block-value">{course.duration || "Self-Paced"}</span>
            </div>
            <div className="meta-block">
              <span className="block-label">Status</span>
              <span className="block-value">{course.status || "Active"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body Columns */}
      <section className="details-body-container">
        <div className="details-grid">
          {/* Left Column: Track Details Card & Syllabus Detail */}
          <div className="details-main-col">
            <div className="desc-card rounded-card shadow-card">
              <h3>Course Description</h3>
              <p className="description-text">
                {course.description || "Learn core foundational theories and practical techniques in this comprehensive course stack. Curated by industry practitioners, this pathway offers hands-on coding environments and direct project reviews."}
              </p>
              
              <div className="desc-specs-grid">
                <div className="spec-tile">
                  <span className="spec-icon">⏱️</span>
                  <div>
                    <span className="spec-label">Duration</span>
                    <span className="spec-value">{course.duration || "Self-Paced"}</span>
                  </div>
                </div>
                <div className="spec-tile">
                  <span className="spec-icon">👨‍🏫</span>
                  <div>
                    <span className="spec-label">Instructor</span>
                    <span className="spec-value">{course.instructor || "LernX Team"}</span>
                  </div>
                </div>
                <div className="spec-tile">
                  <span className="spec-icon">⚡</span>
                  <div>
                    <span className="spec-label">Difficulty</span>
                    <span className="spec-value">{course.difficulty || "All Levels"}</span>
                  </div>
                </div>
                <div className="spec-tile">
                  <span className="spec-icon">🚀</span>
                  <div>
                    <span className="spec-label">Skill Status</span>
                    <span className="spec-value">{course.status || "Active"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Syllabus Preview */}
            <div className="syllabus-preview-card rounded-card shadow-card">
              <h3>Course Outline</h3>
              <p className="section-intro">Explore what you will learn in this curriculum pathway.</p>
              
              <div className="syllabus-list-outline">
                {syllabus.length === 0 ? (
                  <p className="no-syllabus">No syllabus curriculum published yet.</p>
                ) : (
                  normalizeArray(syllabus).map((mod, index) => (
                    <div className="syllabus-module-item" key={mod._id}>
                      <div className="module-index-header">
                        <span className="mod-idx-badge">Module {index + 1}</span>
                        <span className="mod-idx-name">{mod.name}</span>
                      </div>
                      <ul className="submodule-preview-list">
                        {normalizeArray(mod.subModules).map((sub) => (
                          <li key={sub._id} className="submodule-preview-item">
                            <span className="play-circle-icon">▶</span>
                            <span>{sub.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Explore Syllabus & Enrollment Progress */}
          <div className="details-sidebar-col">
            <div className="explore-syllabus-card rounded-card shadow-card">
              <h3>Explore Syllabus</h3>
              
              {isEnrolled ? (
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Enrolled Course Progress</span>
                    <span className="prog-percent">{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                  
                  {progress === 100 ? (
                    <div className="completion-block">
                      <span className="badge-complete">🎓 Finished</span>
                      {hasCertificate ? (
                        <button
                          className="btn-download-cert"
                          onClick={() => navigate("/profile")}
                        >
                          View Certificate
                        </button>
                      ) : (
                        <button
                          className="btn-generate-cert"
                          onClick={handleGenerateCertificate}
                          disabled={loadingCertificate}
                        >
                          {loadingCertificate ? "Validating..." : "Generate Certificate"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="syllabus-info-note">
                      Complete all submodules in the roadmap workspace to unlock your certificate.
                    </p>
                  )}
                </div>
              ) : (
                <div className="pre-enroll-section">
                  <p className="pre-enroll-note">
                    Unlock all syllabus tutorials, videos, and project files by joining this course.
                  </p>
                </div>
              )}

              <div className="action-buttons-wrapper">
                {isEnrolled ? (
                  <button
                    className="btn-primary-action btn-continue"
                    onClick={() => navigate(`/player/${course._id}`)}
                  >
                    Continue Learning →
                  </button>
                ) : (
                  <button
                    className="btn-primary-action btn-enroll"
                    onClick={handleEnroll}
                    disabled={loadingAction}
                  >
                    {loadingAction ? "Registering Session..." : "Start Learning"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
