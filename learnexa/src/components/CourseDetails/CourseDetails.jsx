import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, getModules, getMyEnrollments } from '../api/courseContentApi'; 
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseConfigurationData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch dynamic course reference metrics matching token variables
                const currentCourse = await getCourse(id);
                if (currentCourse) {
                    setCourse(currentCourse);
                } else {
                    // Fallback control systems match mapping sequence properties
                    setCourse({
                        _id: id,
                        name: 'HTML5 Essentials',
                        description: 'Master the building blocks of web development with HTML5. Learn structuring pages, tags, tables, forms, and modern semantic elements.',
                        duration: '4 Weeks',
                        instructor: 'Sarah Jenkins'
                    });
                }
            } catch (err) {
                console.warn("API 401 Execution intercept match fallback matrix loading context.", err);
                setCourse({
                    _id: id,
                    name: 'HTML5 Essentials',
                    description: 'Master the building blocks of web development with HTML5. Learn structuring pages, tags, tables, forms, and modern semantic elements.',
                    duration: '4 Weeks',
                    instructor: 'Sarah Jenkins'
                });
            }

            try {
                // 2. Query target structural modules sequence mapping properties 
                const modulesData = await getModules(id);
                setModules(Array.isArray(modulesData) ? modulesData : []);
            } catch (err) {
                console.warn("Module payload request intercepted by token block restrictions.", err);
                setModules([]); 
            }

            try {
                // 3. Map enrollment configurations status checking
                const enrollments = await getMyEnrollments();
                if (Array.isArray(enrollments)) {
                    const activeEnrollment = enrollments.find((e) => {
                        const cId = e.courseId?._id || e.courseId;
                        return cId === id;
                    });
                    
                    if (activeEnrollment) {
                        setIsEnrolled(true);
                        setEnrollmentId(activeEnrollment._id);
                        setProgress(activeEnrollment.completionPercentage || 0);
                    }
                }
            } catch (err) {
                console.warn("Enrollment profiles lookup restricted due to credential metrics verification fail.", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseConfigurationData();
        }
    }, [id]);

    const handleEnrollmentAction = async () => {
        if (isEnrolled) {
            navigate(`/learn/${id}`);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session context unverified! Redirecting to structural user login framework.");
                navigate('/login'); 
                return;
            }

            const response = await fetch('https://brillon-tasks-1.onrender.com/api/v1/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseId: id })
            });

            const data = await response.json();
            if (response.ok) {
                setIsEnrolled(true);
                setEnrollmentId(data._id || data.id);
                navigate(`/learn/${id}`);
            } else {
                alert(data.error || "Enrollment initial configuration procedure failed.");
            }
        } catch (err) {
            alert("Network connection error across data interface channels.");
        }
    };

    if (loading) return <div className="loading-state">Optimizing Course Blueprint...</div>;
    if (!course) return <div className="error-state">Target node reference error.</div>;

    return (
        <div className="details-container">
            <div className="hero-banner">
                <span className="badge-category">BEGINNER</span>
                <h1 className="course-main-title">{course.name}</h1>
                <p className="instructor-tag">Instructed by <strong>{course.instructor || 'Sarah Jenkins'}</strong></p>
            </div>

            <div className="content-layout-grid">
                <div className="primary-column">
                    <section className="info-card">
                        <h3 className="section-title">Course Description</h3>
                        <p className="description-text">{course.description}</p>
                        
                        <div className="meta-stats-row">
                            <div className="stat-node">
                                <span className="stat-label">Duration</span>
                                <span className="stat-value">{course.duration || '4 Weeks'}</span>
                            </div>
                            <div className="stat-node">
                                <span className="stat-label">Instructor</span>
                                <span className="stat-value">{course.instructor || 'Sarah Jenkins'}</span>
                            </div>
                            <div className="stat-node">
                                <span className="stat-label">Difficulty</span>
                                <span className="stat-value">Beginner</span>
                            </div>
                        </div>
                    </section>

                    <section className="info-card">
                        <h3 className="section-title">Syllabus Roadmap</h3>
                        <div className="syllabus-stack">
                            {modules.length > 0 ? (
                                modules.map((mod, index) => (
                                    <div key={mod._id || index} className="syllabus-item">
                                        <span className="bullet-icon">📁</span>
                                        <div className="item-text">
                                            <h4>Module {index + 1}: {mod.name}</h4>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="fallback-list-item">
                                    <p>📁 Module 1: Introduction Essentials</p>
                                    <p>📁 Module 2: Core Development Standards</p>
                                    <p>📁 Module 3: Advanced Architectures & Integration</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="secondary-sidebar">
                    <div className="sticky-action-card">
                        <h3 className="sidebar-card-title">Explore Syllabus</h3>
                        <p className="sidebar-sub">Enroll to unlock interactive video modules, structural assignments, and earn your verified certificate.</p>
                        
                        <div className="progress-container-box">
                            <div className="progress-labels">
                                <span className="progress-label-text">Progress</span>
                                <span className="progress-percentage-num">{progress}%</span>
                            </div>
                            <div className="progress-track-bar">
                                <div className="progress-fill-bar" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>

                        {/* Interactive dynamic enrollment status check to handle toggles seamlessly */}
                        <button className="primary-action-btn" onClick={handleEnrollmentAction}>
                            {isEnrolled ? '[ Continue Learning ]' : '[ Start Learning ]'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;