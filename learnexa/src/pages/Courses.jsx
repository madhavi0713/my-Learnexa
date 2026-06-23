import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments, getCategories, getDomains } from "../api/hierarchyApi";
import { getCourses } from "../api/courseApi";
import { getMyEnrollments, enrollInCourse } from "../api/enrollmentApi";
import CourseCard from "../components/CourseCard";
import {
  FaCode, FaBriefcase, FaGlobe, FaChartLine, FaPaintBrush,
  FaHandshake, FaCloud, FaShieldAlt, FaFlask, FaRobot,
  FaKeyboard, FaBook, FaExclamationTriangle, FaFolderOpen,
  FaArrowRight
} from "react-icons/fa";
import "./Courses.css";

const Courses = () => {
  const navigate = useNavigate();
  // Navigation states
  // level 0: Departments, 1: Categories, 2: Domains, 3: Tracks, 4: Courses
  const [level, setLevel] = useState(0);
  const [history, setHistory] = useState([]); // Array of { level, items, title }

  const [items, setItems] = useState([]); // Current level items (depts, cats, domains, etc.)
  const [title, setTitle] = useState("Courses Catalog");
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedState = sessionStorage.getItem("courses_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setLevel(parsed.level);
        setHistory(parsed.history);
        setItems(parsed.items);
        setTitle(parsed.title);
        setLoading(false);
        fetchEnrollmentsOnly();
      } catch (err) {
        console.warn("Failed loading saved courses state", err);
        loadInitialData();
      }
    } else {
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save state to sessionStorage when any core hierarchy changes
  useEffect(() => {
    if (items && items.length > 0) {
      sessionStorage.setItem(
        "courses_state",
        JSON.stringify({ level, history, items, title })
      );
    }
  }, [level, history, items, title]);

  const fetchEnrollmentsOnly = async () => {
    try {
      const enrolls = await getMyEnrollments();
      setEnrollments(enrolls);
    } catch (err) {
      console.error("Failed fetching enrollments only", err);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const depts = await getDepartments();
      setItems(depts);
      setLevel(0);
      setTitle("Courses Catalog");

      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
        try {
          const enrolls = await getMyEnrollments();
          setEnrollments(enrolls);
        } catch (enrollErr) {
          console.warn("Failed fetching enrollments, continuing as guest", enrollErr);
        }
      }
    } catch (err) {
      console.error("Failed to load initial courses hierarchy", err);
      setError("Failed to connect to the learning hierarchy server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (item) => {
    setLoading(true);
    setError(null);

    // Save current state in history before proceeding
    const previousState = {
      level,
      items,
      title,
    };
    const newHistory = [...history, previousState];
    setHistory(newHistory);

    try {
      let result = [];
      let newTitle = item.name || item.title;

      if (level === 0) {
        // Department clicked -> fetch Categories
        result = await getCategories(item._id);
        setItems(result);
        setLevel(1);
        setTitle(newTitle);
      } else if (level === 1) {
        // Category clicked -> fetch Domains
        result = await getDomains(item._id);
        setItems(result);
        setLevel(2);
        setTitle(newTitle);
      } else if (level === 2) {
        // Domain clicked -> fetch Courses directly, skipping Tracks
        result = await getCourses(item._id);
        setItems(result || []);
        setLevel(4);
        setTitle(`${newTitle} Pathway`);
      } else if (level === 3) {
        // Legacy tracks level fallback (unused now, but kept for safe bounds if history acts weird)
        result = await getCourses(item._id);
        if (result && result.length > 0) {
          navigate(`/course/${result[0]._id}`);
        } else {
          setItems([]);
          setLevel(4);
          setTitle(`${newTitle} Pathway`);
        }
      }
    } catch (err) {
      console.error("Error fetching sub-hierarchy", err);
      setError("Failed to fetch curriculum levels.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (history.length === 0) {
      navigate("/");
      return;
    }
    const previousState = history[history.length - 1];
    setItems(previousState.items);
    setLevel(previousState.level);
    setTitle(previousState.title);
    setHistory(history.slice(0, -1));
    setError(null);
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      // Immediately refresh enrollments list
      const enrolls = await getMyEnrollments();
      setEnrollments(enrolls);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to enroll. Please login first.");
      throw err;
    }
  };

  const getHierarchyIcon = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("tech") && !n.includes("non")) return <FaCode />;
    if (n.includes("non")) return <FaBriefcase />;
    if (n.includes("web")) return <FaGlobe />;
    if (n.includes("data")) return <FaChartLine />;
    if (n.includes("design")) return <FaPaintBrush />;
    if (n.includes("business")) return <FaHandshake />;
    if (n.includes("cloud")) return <FaCloud />;
    if (n.includes("cyber") || n.includes("security")) return <FaShieldAlt />;
    if (n.includes("science")) return <FaFlask />;
    if (n.includes("artificial")) return <FaRobot />;
    if (n.includes("code") || n.includes("program")) return <FaKeyboard />;
    return <FaBook />;
  };

  const getHierarchyDesc = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("technical department")) return "Master coding languages, frameworks, AI databases, and modern cloud deployment protocols.";
    if (n.includes("non technical")) return "Hone key professional traits like team dynamics, business administration, and soft skills.";
    if (n.includes("web dev")) return "Explore responsive styling, client interfaces, server logic, and fullstack frameworks.";
    if (n.includes("data science")) return "Learn statistical modeling, regression models, big data frameworks, and analytics.";
    if (n.includes("artificial")) return "Master neural structures, automation algorithms, natural processing models, and deep learning.";
    return "Unlock structured learning pathways and career advancements in this category.";
  };

  return (
    <div className="courses-page-container">
      <div className="courses-header-section">
        <div className="courses-header-content">
          <div className="navigation-controls">
            <button className="btn-hierarchy-back" onClick={goBack}>
              ← Back
            </button>
          </div>
          <h1 className="courses-section-title">{title}</h1>
          <p className="courses-section-subtitle">
            {level === 0 && "Navigate through our structured learning curriculum to discover courses, modules, videos, and assessments."}
            {level === 1 && "Browse specialized disciplines under this study track."}
            {level === 2 && "Choose a subject area to narrow down learning pathways."}
            {level === 3 && "Select a career track path to load enrollment courses."}
            {level === 4 && "Explore the courses available in this pathway to start learning."}
          </p>
        </div>
      </div>

      <div className="courses-main-viewport">
        {loading ? (
          <div className="viewport-loading-state">
            <div className="lms-spinner"></div>
            <p>Retrieving syllabus pathways...</p>
          </div>
        ) : error ? (
          <div className="viewport-error-state">
            <div className="error-icon"><FaExclamationTriangle /></div>
            <h3>Curriculum Synced Issues</h3>
            <p>{error}</p>
            <button className="btn-lms-retry" onClick={loadInitialData}>
              Retry Load
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="viewport-empty-state">
            <div className="empty-icon"><FaFolderOpen /></div>
            <h3>
              {level === 0 ? "No Categories Found" :
               level === 1 ? "No Domains Found" :
               level === 2 ? "No Tracks Found" :
               "No Courses Found"}
            </h3>
            <p>There are currently no items published at this level of hierarchy.</p>
            {level > 0 && (
              <button className="btn-lms-retry" onClick={goBack}>
                Go Back
              </button>
            )}
          </div>
        ) : level === 4 ? (
          // Level 4 renders Course Cards
          <div className="courses-catalog-grid">
            {items.map((course) => {
              const enrollment = enrollments.find((e) => e.courseId?._id === course._id || e.courseId === course._id);
              return (
                <CourseCard
                  key={course._id}
                  course={course}
                  enrollment={enrollment}
                  onEnroll={handleEnroll}
                />
              );
            })}
          </div>
        ) : (
          // Levels 0-3 render hierarchy cards (Udemy-like cards layout)
          <div className="hierarchy-cards-grid">
            {items.map((item, index) => (
              <div key={item._id} className={`hierarchy-item-card dept-card-${index % 4}`} onClick={() => handleCardClick(item)}>
                <div className="hierarchy-card-banner">
                  <div className="hierarchy-card-icon-wrapper">
                    {getHierarchyIcon(item.name)}
                  </div>
                  <div className="hierarchy-card-banner-glow" />
                </div>
                <div className="hierarchy-card-content">
                  <span className="hierarchy-card-label">Curriculum Group</span>
                  <h3 className="hierarchy-card-title">{item.name}</h3>
                  <p className="hierarchy-card-desc">{getHierarchyDesc(item.name)}</p>
                  <div className="hierarchy-card-action-outline">
                    <span>Explore category</span>
                    <FaArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
