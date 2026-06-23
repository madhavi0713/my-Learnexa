import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getModules, 
    getSubModules, 
    getVideos, 
    getMyEnrollments, 
    updateProgress 
} from '../api/courseContentApi'; 
import './CoursePlayer.css';

const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [modules, setModules] = useState([]);
    const [subModules, setSubModules] = useState({});
    const [videos, setVideos] = useState({});
    
    const [activeItem, setActiveItem] = useState(null); 
    const [expandedModule, setExpandedModule] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializePlayerWorkspace = async () => {
            if (!id || id === 'undefined') return;

            try {
                setLoading(true);
                
                // 1. Fetch system tracking logs using safe Axios pipeline handles
                const enrollments = await getMyEnrollments();
                if (Array.isArray(enrollments)) {
                    const currentEnroll = enrollments.find((e) => {
                        const cId = e.courseId?._id || e.courseId;
                        return cId === id;
                    });
                    
                    if (currentEnroll) {
                        setEnrollmentId(currentEnroll._id);
                        setProgress(currentEnroll.completionPercentage || 0);
                    }
                }
            } catch (err) {
                console.warn("Authorization verification block during enrollment history scan.", err);
            }

            try {
                // 2. Try fetching active courses structural tracks elements modules
                const modulesData = await getModules(id);
                const validModules = Array.isArray(modulesData) ? modulesData : [];
                setModules(validModules);

                if (validModules.length > 0) {
                    setExpandedModule(validModules[0]._id);
                    await fetchSubModulesAndContent(validModules[0]._id);
                }
            } catch (err) {
                console.warn("Modules layout map execution failed on authentication tokens verification.", err);
                setModules([]); // Activate fallback tree checks inside layout
            } finally {
                setLoading(false);
            }
        };

        initializePlayerWorkspace();
    }, [id]);

    const fetchSubModulesAndContent = async (moduleId) => {
        try {
            const subModulesData = await getSubModules(moduleId);
            const subModuleArray = Array.isArray(subModulesData) ? subModulesData : [];
            
            setSubModules(prev => ({ ...prev, [moduleId]: subModuleArray }));

            for (const sub of subModuleArray) {
                const videoData = await getVideos(sub._id);
                setVideos(prev => ({
                    ...prev,
                    [sub._id]: Array.isArray(videoData) ? videoData : []
                }));
            }

            if (subModuleArray.length > 0 && !activeItem) {
                setActiveItem({ type: 'submodule', data: subModuleArray[0] });
            }
        } catch (err) {
            console.error("Submodule configuration array cascade sync error:", err);
        }
    };

    const handleModuleToggle = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
        if (!subModules[moduleId]) {
            fetchSubModulesAndContent(moduleId);
        }
    };

    const handleMarkComplete = async () => {
        if (!activeItem || !enrollmentId) {
            alert("Tracking context resolution failure. Session verification invalid.");
            return;
        }

        const targetSubModuleId = activeItem.type === 'submodule' 
            ? activeItem.data._id 
            : activeItem.data.subModuleId;

        if (!targetSubModuleId) return;

        try {
            const responseData = await updateProgress(enrollmentId, targetSubModuleId);
            const newProgress = responseData.completionPercentage ?? responseData.data?.completionPercentage ?? progress;
            setProgress(newProgress);
            alert("Progress tracking metrics parameter successfully updated!");
        } catch (err) {
            console.error("Progress tracking confirmation failure:", err);
            alert("Failed updating progress metadata elements mapping parameters.");
        }
    };

    if (loading) return <div className="player-loading">Streaming interactive nodes...</div>;

    return (
        <div className="player-container">
            {/* Sidebar View Framework */}
            <aside className="roadmap-sidebar">
                <div className="sidebar-header-meta">
                    <h2 className="roadmap-title">Syllabus Roadmap</h2>
                    <div className="sidebar-progress-wrapper">
                        <span className="progress-text-tag">Progress</span>
                        <span className="progress-value-tag">{progress}%</span>
                    </div>
                </div>

                <nav className="accordion-menu">
                    {modules.length > 0 ? (
                        modules.map((mod, idx) => (
                            <div key={mod._id || idx} className="module-group">
                                <button 
                                    className={`module-trigger ${expandedModule === mod._id ? 'active' : ''}`}
                                    onClick={() => handleModuleToggle(mod._id)}
                                >
                                    ▼ Module {idx + 1}: {mod.name}
                                </button>
                                
                                {expandedModule === mod._id && (
                                    <div className="submodule-list-items">
                                        {subModules[mod._id]?.map((sub) => (
                                            <div key={sub._id} className="submodule-nested-group">
                                                
                                                <button 
                                                    className={`submodule-item-btn ${activeItem?.type === 'submodule' && activeItem.data._id === sub._id ? 'selected' : ''}`}
                                                    onClick={() => setActiveItem({ type: 'submodule', data: sub })}
                                                >
                                                    📄 {sub.name}
                                                </button>

                                                {videos[sub._id]?.map((vid) => (
                                                    <button
                                                        key={vid._id}
                                                        className={`submodule-item-btn video-sub-btn ${activeItem?.type === 'video' && activeItem.data._id === vid._id ? 'selected' : ''}`}
                                                        onClick={() => setActiveItem({ type: 'video', data: vid })}
                                                    >
                                                        ▶ {vid.title} <span className="vid-duration">({vid.duration || 'N/A'})</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )) || <div className="sub-loading">Synchronizing active components maps...</div>}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        /* Standard visual design fallback parameters when api credentials fail */
                        <div className="fallback-accordion">
                            <div className="fallback-hdr">▼ Module 1: Tutorials Module</div>
                            <div className="fallback-sub-stack">
                                <button 
                                    className={`fallback-sub-btn ${!activeItem || activeItem.data.name === 'Tutorials Topic' ? 'active' : ''}`}
                                    onClick={() => setActiveItem({ type: 'submodule', data: { _id: 'f1', name: 'Tutorials Topic' } })}
                                >
                                    Tutorials Topic
                                </button>
                                <button 
                                    className={`fallback-sub-btn ${activeItem?.data.name === 'Tutorials Video Lesson' ? 'active' : ''}`}
                                    onClick={() => setActiveItem({ type: 'submodule', data: { _id: 'f2', name: 'Tutorials Video Lesson' } })}
                                >
                                    Tutorials Video Lesson
                                </button>
                            </div>
                            <div className="disabled-hdr">🔒 Assignments (No Content)</div>
                            <div className="disabled-hdr">🔒 Quizzes (No Content)</div>
                        </div>
                    )}
                </nav>

                <button className="leave-player-btn" onClick={() => navigate(-1)}>
                    ← Leave Player
                </button>
            </aside>

            {/* Content Workspace Area Stage Component Canvas */}
            <main className="content-workspace">
                <header className="workspace-header-bar">
                    <button className="back-nav-btn" onClick={() => navigate(-1)}>← Back</button>
                    <div className="top-banner-progress-pill">Course Progress : {progress}%</div>
                </header>

                <div className="workspace-card">
                    {activeItem ? (
                        <div className="dynamic-content-area">
                            <h1 className="content-headline">{activeItem.data.name || activeItem.data.title}</h1>
                            
                            {activeItem.type === 'video' ? (
                                <div className="video-viewport-wrapper">
                                    {activeItem.data.videoUrl ? (
                                        <iframe
                                            className="video-frame"
                                            src={activeItem.data.videoUrl.replace("watch?v=", "embed/")}
                                            title={activeItem.data.title}
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="no-video-placeholder">Streaming video interface configuration empty.</div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-content-reader">
                                    <p className="instruction-subtext">Review configuration rules and complete reading blocks:</p>
                                    <div className="topic-body-box">
                                        Welcome to your lecture workspace loop covering <strong>{activeItem.data.name}</strong>. Complete items inside this block selection step tracking node sequence to securely increment profiles parameters.
                                    </div>
                                </div>
                            )}

                            <div className="action-interactive-area">
                                <button className="complete-action-trigger-btn" onClick={handleMarkComplete}>
                                    Completed ✓
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="welcome-placeholder">
                            <h1 className="content-headline">Welcome To Learning Stream!</h1>
                            <p className="instruction-subtext">Select an active node roadmap index element from your left console menu panel layer.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CoursePlayer;