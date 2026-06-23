import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { normalizeArray, safeRender } from "../utils/normalizeArray";
import "./Sidebar.css";

const Sidebar = ({
  course,
  modules = [],
  activeSubModule,
  onSelectSubModule,
  completedSubModules = [],
  progress = 0,
}) => {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const isCompleted = (subModuleId) => {
    return completedSubModules.includes(subModuleId);
  };

  return (
    <aside className="lms-sidebar">
      <div className="sidebar-header">
        <h3 className="course-sidebar-title">{course?.name || "Course Player"}</h3>
        <div className="sidebar-progress-container">
          <div className="progress-info">
            <span>Course Progress</span>
            <span className="progress-value">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      <nav className="sidebar-syllabus">
        {normalizeArray(modules).map((module, mIndex) => {
          const isExpanded = expandedModules[module._id] !== false; // Expand by default
          const subModules = module.subModules || [];

          return (
            <div className={`module-accordion ${isExpanded ? "active" : ""}`} key={module._id}>
              <button className="module-trigger" onClick={() => toggleModule(module._id)}>
                <div className="module-trigger-content">
                  <span className="module-index">Module {mIndex + 1}</span>
                  <span className="module-title">{module.name}</span>
                </div>
                <span className={`accordion-icon ${isExpanded ? "rotated" : ""}`}>▼</span>
              </button>

              <div className={`module-content ${isExpanded ? "show" : ""}`}>
                {subModules.length === 0 ? (
                  <div className="empty-submodules">No lectures available</div>
                ) : (
                  <ul className="submodule-list">
                    {normalizeArray(subModules).map((sub) => {
                      const isSelected = activeSubModule?._id === sub._id;
                      const done = isCompleted(sub._id);
                      return (
                        <li key={sub._id}>
                          <button
                            className={`submodule-item ${isSelected ? "selected" : ""} ${done ? "completed" : ""}`}
                            onClick={() => onSelectSubModule(sub)}
                          >
                            <span className="status-marker">
                              {done ? (
                                <svg className="check-icon" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                              ) : (
                                <span className="dot-marker"></span>
                              )}
                            </span>
                            <span className="submodule-item-title">{sub.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-leave-player" onClick={() => navigate(`/course/${course?._id}`)}>
          ← Leave Player
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
