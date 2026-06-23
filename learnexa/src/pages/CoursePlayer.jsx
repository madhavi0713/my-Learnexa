import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseDetails, getModules, getSubModules, getVideos, getAssignments, getFinalAssignments } from "../api/courseApi";
import { getMyEnrollments, updateProgress } from "../api/enrollmentApi";
import { getMyCertificates } from "../api/certificateApi";
import { getFallbackContent, generateQuiz, generateFinalAssignment, getCourseVideo } from "../utils/fallbackContent";
import { createNote, getNotes } from "../api/notesApi";
import { normalizeArray, safeRender } from "../utils/normalizeArray";
import { useAuth } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import {
  FaCheckCircle, FaCheck, FaPlay, FaClipboardList, FaQuestionCircle,
  FaTrophy, FaLock, FaChevronDown, FaChevronRight, FaArrowLeft,
  FaBookOpen, FaVideo, FaArrowRight, FaSpinner, FaLightbulb
} from "react-icons/fa";
import "./CoursePlayer.css";

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

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, token, setCertificates } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingProgress, setSubmittingProgress] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isFallback, setIsFallback] = useState(false);

  // Grouped content states
  const [tutorials, setTutorials] = useState([]);      // submodules
  const [videos, setVideos] = useState([]);            // videos
  const [assignments, setAssignments] = useState([]);    // assignments
  const [quizzes, setQuizzes] = useState([]);          // quizzes from modules
  const [finalAssignments, setFinalAssignments] = useState([]);
  const [certificateData, setCertificateData] = useState(null);

  // Accordion toggle states
  const [sectionsExpanded, setSectionsExpanded] = useState({
    tutorials: true,
    videos: true,
    assignments: true,
    quizzes: true,
    finalAssignment: true,
  });

  // Current active viewport content
  const [activeItem, setActiveItem] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Quiz attempts state
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [isReattempting, setIsReattempting] = useState(false);

  // Assignment states
  const [asmText, setAsmText] = useState("");
  const [asmLink, setAsmLink] = useState("");
  const [asmFile, setAsmFile] = useState(null);

  // Final assignment states
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submittedFinal, setSubmittedFinal] = useState(false);

  // Certificate generation forms
  const [certFormName, setCertFormName] = useState("");
  const [certFormCollege, setCertFormCollege] = useState("");
  const [certFormYear, setCertFormYear] = useState("");

  // Congratulations Modal state
  const [showCongrats, setShowCongrats] = useState(false);

  // Notes states
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [videoNotes, setVideoNotes] = useState([]);

  useEffect(() => {
    fetchCompleteSyllabusChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (activeItem && activeItem.type === "quiz") {
      const quizId = activeItem.data._id;
      const userId = user?._id || user?.email || "guest";
      const savedAttemptStr = localStorage.getItem(`${userId}_${quizId}`);
      if (savedAttemptStr) {
        setQuizAttempt(JSON.parse(savedAttemptStr));
      } else {
        setQuizAttempt(null);
      }
      setIsReattempting(false);
      setQuizAnswers({});
    }
  }, [activeItem, user]);

  useEffect(() => {
    if (activeItem?.type === "video") {
      fetchNotes(activeItem.data._id);
    }
  }, [activeItem, courseId]);

  const fetchNotes = async (videoId) => {
    try {
      const res = await getNotes(courseId);
      const notesData = Array.isArray(res) ? res : res.data || [];
      const filtered = notesData.filter((n) => (n.videoId?._id || n.videoId) === videoId);
      setVideoNotes(filtered);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const handleSaveNote = async (videoId) => {
    if (!noteText.trim()) return;
    setIsSavingNote(true);
    try {
      await createNote(courseId, videoId, noteText);
      setNoteText("");
      fetchNotes(videoId);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save note");
    } finally {
      setIsSavingNote(false);
    }
  };

  const getVideoEmbedUrl = (videoItem, currentTopic) => {
    if (!videoItem) return "";
    
    const isFallback = videoItem._id && videoItem._id.includes("-vid-");
    const hasRealVideo = videoItem.videoUrl && videoItem.videoUrl.trim() !== "" && !videoItem.videoUrl.includes("dQw4w9WgXcQ") && !videoItem.videoUrl.includes("dQw4w9");

    const cTitle = course?.title || course?.name || "";
    const tTitle = currentTopic?.name || currentTopic?.title || videoItem.title || "";

    if (!isFallback && hasRealVideo) {
      let url = videoItem.videoUrl;
      if (url.includes("watch?v=")) {
        url = url.replace("watch?v=", "embed/");
      }
      return url;
    }

    return getCourseVideo(cTitle, tTitle);
  };

  const fetchCompleteSyllabusChain = async () => {
    setLoading(true);
    // Clear previous course states to prevent cross-contamination
    setCourse(null);
    setEnrollment(null);
    setTutorials([]);
    setVideos([]);
    setAssignments([]);
    setQuizzes([]);
    setFinalAssignments([]);
    setCertificateData(null);
    setActiveItem(null);
    setQuizAnswers({});
    setIsFallback(false);

    try {
      // 1. Fetch course metadata
      const courseData = await getCourseDetails(courseId);
      setCourse(courseData);

      // 2. Fetch enrollment and progress
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === courseId || e.courseId === courseId);
      if (!currentEnroll) {
        alert("Please enroll in this course first to start learning.");
        navigate(`/course/${courseId}`);
        return;
      }
      setEnrollment(currentEnroll);

      // 3. Step 1: Fetch modules
      let modulesData = [];
      try {
        modulesData = await getModules(courseId);
      } catch (err) {
        console.warn("Failed fetching modules from API", err);
      }

      // 4. Steps 2, 3, & 4: Fetch submodules, videos, and assignments in sequence
      const allSubModules = [];
      const allVideos = [];
      const allAssignments = [];
      const allQuizzes = [];

      if (modulesData && modulesData.length > 0) {
        for (const mod of modulesData) {
          // Collect quizzes inside module
          if (mod.quizzes && mod.quizzes.length > 0) {
            allQuizzes.push(...mod.quizzes.map(q => ({ ...q, moduleId: mod._id })));
          }

          try {
            const subs = await getSubModules(mod._id);
            allSubModules.push(...subs.map(s => ({ ...s, moduleId: mod._id })));
          } catch (err) {
            console.warn(`Failed fetching submodules for module ${mod._id}`, err);
          }

          try {
            const asms = await getAssignments(mod._id);
            allAssignments.push(...asms.map(a => ({ ...a, moduleId: mod._id })));
          } catch (err) {
            console.warn(`Failed fetching assignments for module ${mod._id}`, err);
          }
        }

        // Fetch videos for each submodule
        for (const sub of allSubModules) {
          try {
            const vids = await getVideos(sub._id);
            allVideos.push(...vids.map(v => ({ ...v, subModuleId: sub._id })));
          } catch (err) {
            console.warn(`Failed fetching videos for submodule ${sub._id}`, err);
          }
        }
      }

      // 5. Step 5: Fetch final assignment
      let finals = [];
      try {
        finals = await getFinalAssignments(courseId);
      } catch (err) {
        console.warn("Failed fetching final assignments", err);
      }

      // Load fallback content database
      const fallback = getFallbackContent(courseData ? (courseData.title || courseData.name) : "", courseId);
      let loadedFallback = false;

      const courseTitle = courseData ? (courseData.title || courseData.name) : "";

      // Merge in fallback if any section returns empty
      if (modulesData.length === 0) {
        loadedFallback = true;
        modulesData = fallback.modules;
      }
      if (allSubModules.length === 0) {
        loadedFallback = true;
        allSubModules.push(...fallback.subModules);
      }
      if (allVideos.length === 0) {
        loadedFallback = true;
        allVideos.push(...fallback.videos);
      }
      if (allAssignments.length === 0) {
        loadedFallback = true;
        allAssignments.push(...fallback.assignments);
      }
      if (allQuizzes.length === 0) {
        loadedFallback = true;
        allQuizzes.push(...fallback.quizzes.map(q => ({
          ...q,
          questions: generateQuiz(courseTitle)
        })));
      } else {
        allQuizzes.forEach(q => {
          q.questions = generateQuiz(courseTitle);
        });
      }
      if (finals.length === 0) {
        loadedFallback = true;
        finals = fallback.finalAssignments.map(f => {
          const dynamicAssignment = generateFinalAssignment(courseTitle);
          return {
            ...f,
            title: dynamicAssignment.title,
            description: dynamicAssignment.description,
            requirements: dynamicAssignment.requirements,
            deliverable: dynamicAssignment.deliverable
          };
        });
      } else {
        finals = finals.map(f => {
          const dynamicAssignment = generateFinalAssignment(courseTitle);
          return {
            ...f,
            title: dynamicAssignment.title,
            description: dynamicAssignment.description,
            requirements: dynamicAssignment.requirements,
            deliverable: dynamicAssignment.deliverable
          };
        });
      }

      setIsFallback(loadedFallback);
      setTutorials(allSubModules);
      setVideos(allVideos);
      setAssignments(allAssignments);
      setQuizzes(allQuizzes);
      setFinalAssignments(finals);

      // Save course items list for progress calculations
      const allItemIds = [
        ...allSubModules.map(t => t._id),
        ...allVideos.map(v => v._id),
        ...allAssignments.map(a => a._id),
        ...allQuizzes.map(q => q._id),
        ...finals.map(f => f._id)
      ];
      localStorage.setItem(`course_items_${courseId}`, JSON.stringify(allItemIds));

      // Re-fetch enrollment to get enriched local progress sync immediately
      const enrichedEnrolls = await getMyEnrollments();
      const enrichedEnroll = enrichedEnrolls.find((e) => e.courseId?._id === courseId || e.courseId === courseId);
      const activeEnroll = enrichedEnroll || currentEnroll;
      setEnrollment(activeEnroll);

      // Set initial item to first tutorial if available
      if (allSubModules.length > 0) {
        setActiveItem({ type: "tutorial", data: allSubModules[0] });
      }

      // Fetch certificate if progress is 100%
      const initialProgress = activeEnroll.progress !== undefined ? activeEnroll.progress : 0;
      if (initialProgress === 100) {
        const certs = await getMyCertificates();
        const earned = certs.find((c) => c.courseId?._id === courseId || c.courseId === courseId);
        if (earned) setCertificateData(earned);
      }
    } catch (err) {
      console.error("Failed executing sequence curriculum chains", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (targetItemId, itemType) => {
    if (!enrollment) return;
    
    // Guard: Never allow duplicate PUT calls/completions
    if (enrollment.completedSubModules?.includes(targetItemId)) {
      return;
    }

    setSubmittingProgress(true);

    let targetSubModuleId = null;

    if (itemType === "tutorial") {
      targetSubModuleId = targetItemId;
    } else if (itemType === "video") {
      if (targetItemId === `${courseId}-vid-1`) {
        targetSubModuleId = targetItemId;
      } else {
        const vid = videos.find((v) => v._id === targetItemId);
        targetSubModuleId = vid ? vid.subModuleId : null;
      }
    } else if (itemType === "assignment") {
      if (targetItemId.startsWith(`${courseId}-asm-`)) {
        targetSubModuleId = targetItemId;
      } else {
        const asm = assignments.find((a) => a._id === targetItemId);
        const sub = tutorials.find((s) => s.moduleId === asm?.moduleId);
        targetSubModuleId = sub ? sub._id : (tutorials[0]?._id || null);
      }
    } else if (itemType === "quiz") {
      if (targetItemId === `${courseId}-quiz-1`) {
        targetSubModuleId = targetItemId;
      } else {
        const qz = quizzes.find((q) => q._id === targetItemId);
        const sub = tutorials.find((s) => s.moduleId === qz?.moduleId);
        targetSubModuleId = sub ? sub._id : (tutorials[0]?._id || null);
      }
    } else if (itemType === "final-assignment") {
      if (targetItemId === `${courseId}-final-1`) {
        targetSubModuleId = targetItemId;
      } else {
        targetSubModuleId = tutorials[tutorials.length - 1]?._id || null;
      }
    }

    if (!targetSubModuleId) {
      alert("Invalid submodule context mapping.");
      setSubmittingProgress(false);
      return;
    }

    // Save fallback/item to localStorage
    const userId = user?._id || user?.email || "guest";
    const completedKey = `completed_items_${userId}_${courseId}`;
    const completedItems = JSON.parse(localStorage.getItem(completedKey) || "[]");
    if (!completedItems.includes(targetItemId)) {
      completedItems.push(targetItemId);
      localStorage.setItem(completedKey, JSON.stringify(completedItems));
    }
    if (!completedItems.includes(targetSubModuleId)) {
      completedItems.push(targetSubModuleId);
      localStorage.setItem(completedKey, JSON.stringify(completedItems));
    }

    // Determine the API target submodule ID to update on backend
    const isFallbackId = targetSubModuleId.startsWith(courseId);
    let apiSubModuleId = targetSubModuleId;

    if (isFallbackId) {
      // Look for a real DB submodule to represent progress
      const realSub = tutorials.find((t) => !t._id.startsWith(courseId));
      apiSubModuleId = realSub ? realSub._id : null;
    }

    try {
      if (apiSubModuleId && !enrollment.completedSubModules?.includes(apiSubModuleId)) {
        await updateProgress(enrollment._id, apiSubModuleId);
      }
      
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === courseId || e.courseId === courseId);
      if (currentEnroll) {
        setEnrollment(currentEnroll);

        const currentProgress = currentEnroll.progress !== undefined ? currentEnroll.progress : 0;
        if (currentProgress === 100) {
          const certs = await getMyCertificates();
          const earned = certs.find((c) => c.courseId?._id === courseId || c.courseId === courseId);
          if (earned) setCertificateData(earned);
        }
      }
    } catch (err) {
      console.error("Failed saving completion progress on backend", err);
      // Fall back to local progress update
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === courseId || e.courseId === courseId);
      if (currentEnroll) {
        setEnrollment(currentEnroll);
      }
    } finally {
      setSubmittingProgress(false);
    }
  };



  const fetchMyCertificates = async () => {
    const BASE_URL = "https://brillon-tasks-1.onrender.com/api/v1";
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("userToken");
    try {
      const res = await fetch(`${BASE_URL}/certificates/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      setCertificates(data.data || data || []);
    } catch (err) {
      console.error("Failed to fetch my certificates", err);
    }
  };

  const handleFormGenerateCert = async (e) => {
    e.preventDefault();
    if (!enrollment || progress !== 100) return;
    setSubmittingProgress(true);

    const BASE_URL = "https://brillon-tasks-1.onrender.com/api/v1";
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("userToken");
    const targetCourseId = courseId || course?._id;

    const body = {
      courseId: targetCourseId,
      studentName: certFormName,
      collegeName: certFormCollege,
      year: certFormYear
    };

    console.log("Certificate Generation Body:", JSON.stringify(body, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok && response.status !== 400) {
        const err = await response.json();
        console.error('Certificate generation failed:', err);
        alert(err.message || err.error || 'Certificate generation failed');
        return;
      }

      let certData;
      if (response.status === 400) {
        const res2 = await fetch(`${BASE_URL}/certificates/me`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data2 = await res2.json();
        const earned = (data2.data || data2 || []).find((c) => c.courseId?._id === targetCourseId || c.courseId === targetCourseId);
        certData = earned;
      } else {
        const certResData = await response.json();
        certData = certResData.data || certResData;
      }

      // Save certificate data to state/context
      if (certData) setCertificateData(certData);

      // Re-fetch certificates without page reload to update profile/state (Fix 4)
      await fetchMyCertificates();
    } catch (err) {
      console.error("Failed generating certificate:", err);
      // Fallback mock cert in case backend fails
      const mockCert = {
        _id: `mock-cert-${courseId}-${Date.now().toString(16)}`,
        courseId: { _id: courseId, name: cleanCourseName(course?.name, course?.description) },
        studentName: certFormName,
        collegeName: certFormCollege,
        year: certFormYear,
        createdAt: new Date().toISOString()
      };
      setCertificateData(mockCert);
      navigate('/certificate/preview', { state: { cert: mockCert, course } });
    } finally {
      setSubmittingProgress(false);
    }
  };

  const handleSubmitQuiz = async () => {
    const questions = activeItem.data.questions || [];
    const unanswered = questions.some((_, qIndex) => !quizAnswers[`${activeItem.data._id}-${qIndex}`]);
    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    questions.forEach((q, qIndex) => {
      const selected = quizAnswers[`${activeItem.data._id}-${qIndex}`];
      if (selected === q.answer) {
        correctCount++;
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = percentage >= 75;

    const attempt = {
      score: correctCount,
      total,
      percentage,
      passed,
      attemptedAt: new Date().toISOString()
    };

    const quizId = activeItem.data._id;
    const userId = user?._id || user?.email || "guest";
    localStorage.setItem(`${userId}_${quizId}`, JSON.stringify(attempt));
    setQuizAttempt(attempt);
    setIsReattempting(false);

    const completedKey = `completed_items_${userId}_${courseId}`;
    let completedItems = JSON.parse(localStorage.getItem(completedKey) || "[]");

    if (passed) {
      await handleMarkComplete(activeItem.data._id, "quiz");
    } else {
      // Revert complete status on backend / localStorage if a reattempt score is < 75%
      completedItems = completedItems.filter(id => id !== quizId);

      // Find submodule mapping if applicable and remove it
      let targetSubModuleId = null;
      if (quizId === `${courseId}-quiz-1`) {
        targetSubModuleId = quizId;
      } else {
        const qz = quizzes.find((q) => q._id === quizId);
        const sub = tutorials.find((s) => s.moduleId === qz?.moduleId);
        targetSubModuleId = sub ? sub._id : (tutorials[0]?._id || null);
      }
      if (targetSubModuleId) {
        completedItems = completedItems.filter(id => id !== targetSubModuleId);
      }
      localStorage.setItem(completedKey, JSON.stringify(completedItems));

      // Re-fetch enrollment to update state (checkmark and progress percentage sync)
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === courseId || e.courseId === courseId);
      if (currentEnroll) {
        setEnrollment(currentEnroll);
      }
    }
  };

  const handleSubmitAssignment = async () => {
    if (!asmText.trim() && !asmLink.trim() && !asmFile) {
      alert("Please write your answer, paste a Google Drive link, or upload a file.");
      return;
    }
    setSubmittingProgress(true);
    try {
      await handleMarkComplete(activeItem.data._id, "assignment");
      alert("Assignment submitted successfully");
      setAsmText("");
      setAsmLink("");
      setAsmFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit assignment.");
    } finally {
      setSubmittingProgress(false);
    }
  };

  const handleSubmitFinalAssignment = async () => {
    if (!submissionLink.trim() && !submissionFile) {
      alert("Please upload a file or paste a Google Drive link before submitting.");
      return;
    }
    setSubmittingProgress(true);

    const enrollmentId = enrollment?._id;
    const finalAssignmentSubModuleId = activeItem.data._id;
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("userToken");

    console.log("--- FINAL ASSIGNMENT SUBMISSION CHECKLIST ---");
    console.log("Log enrollmentId:", enrollmentId);
    console.log("Log finalAssignmentSubModuleId:", finalAssignmentSubModuleId);
    console.log("Log token:", authToken ? `Bearer ${authToken.substring(0, 15)}...` : "NOT FOUND");

    try {
      // 1. Save to local storage for progress 100%
      const userId = user?._id || user?.email || "guest";
      const completedKey = `completed_items_${userId}_${courseId}`;
      
      // Mark all items complete to guarantee progress reaches 100%
      const courseItemsStr = localStorage.getItem(`course_items_${courseId}`);
      if (courseItemsStr) {
        try {
          const courseItems = JSON.parse(courseItemsStr);
          localStorage.setItem(completedKey, JSON.stringify(courseItems));
        } catch (e) {
          console.error("Failed parsing course items", e);
        }
      } else {
        const completedItems = JSON.parse(localStorage.getItem(completedKey) || "[]");
        if (!completedItems.includes(finalAssignmentSubModuleId)) {
          completedItems.push(finalAssignmentSubModuleId);
          localStorage.setItem(completedKey, JSON.stringify(completedItems));
        }
      }

      // 2. Determine target API submodule ID to send on backend
      const isFallbackId = finalAssignmentSubModuleId.startsWith(courseId);
      let apiSubModuleId = finalAssignmentSubModuleId;

      if (isFallbackId) {
        // Look for a real DB submodule to represent progress
        const realSub = tutorials.find((t) => !t._id.startsWith(courseId));
        apiSubModuleId = realSub ? realSub._id : null;
      }

      let putResponseStatus = null;
      if (apiSubModuleId) {
        console.log(`Sending PUT progress with subModuleId: ${apiSubModuleId}`);
        try {
          const putRes = await updateProgress(enrollmentId, apiSubModuleId);
          putResponseStatus = 200;
          console.log("Log PUT response status: 200 (Success)");
          console.log("PUT Response data:", putRes);
        } catch (apiErr) {
          console.error("PUT progress request failed:", apiErr);
          putResponseStatus = apiErr.response?.status || 500;
          console.log("Log PUT response status:", putResponseStatus);
        }
      } else {
        console.log("Skipping progress PUT call because there is no database submodule mapping.");
      }

      // 3. Re-fetch enrollments to refresh progress in player
      const enrolls = await getMyEnrollments();
      const currentEnroll = enrolls.find((e) => e.courseId?._id === courseId || e.courseId === courseId);
      console.log("Log GET /enrollments/me response progress:", currentEnroll?.progress);
      
      if (currentEnroll) {
        setEnrollment(currentEnroll);
        
        // Fetch certificate if progress is 100%
        if (currentEnroll.progress === 100) {
          const certs = await getMyCertificates();
          const earned = certs.find((c) => c.courseId?._id === courseId || c.courseId === courseId);
          if (earned) setCertificateData(earned);
        }
      }

      setSubmittedFinal(true);
      setShowCongrats(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit assignment.");
    } finally {
      setSubmittingProgress(false);
    }
  };

  const isCompleted = (itemId, itemType) => {
    if (!enrollment) return false;
    const completedList = enrollment.completedSubModules || [];

    if (itemType === "quiz") {
      const quizId = itemId;
      const userId = user?._id || user?.email || "guest";
      const savedAttemptStr = localStorage.getItem(`${userId}_${quizId}`);
      if (savedAttemptStr) {
        const attempt = JSON.parse(savedAttemptStr);
        if (!attempt.passed) return false;
      }
    }

    if (itemType === "tutorial") {
      return completedList.includes(itemId);
    } else if (itemType === "video") {
      if (itemId === `${courseId}-vid-1`) {
        return completedList.includes(itemId);
      }
      const vid = videos.find((v) => v._id === itemId);
      return vid ? (completedList.includes(vid._id) || completedList.includes(vid.subModuleId)) : false;
    } else if (itemType === "assignment") {
      if (itemId.startsWith(`${courseId}-asm-`)) {
        return completedList.includes(itemId);
      }
      const asm = assignments.find((a) => a._id === itemId);
      const sub = tutorials.find((s) => s.moduleId === asm?.moduleId);
      return sub ? (completedList.includes(asm._id) || completedList.includes(sub._id)) : false;
    } else if (itemType === "quiz") {
      if (itemId === `${courseId}-quiz-1`) {
        return completedList.includes(itemId);
      }
      const qz = quizzes.find((q) => q._id === itemId);
      const sub = tutorials.find((s) => s.moduleId === qz?.moduleId);
      return sub ? (completedList.includes(qz._id) || completedList.includes(sub._id)) : false;
    } else if (itemType === "final-assignment") {
      if (itemId === `${courseId}-final-1`) {
        return completedList.includes(itemId);
      }
      return completedList.includes(itemId);
    }
    return false;
  };

  const toggleSection = (sectionName) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const renderMarkCompleteBtn = (itemId, itemType) => {
    const done = isCompleted(itemId, itemType);
    if (done) {
      return (
        <button className="btn-complete-sub completed" disabled style={{ opacity: 0.75, cursor: "not-allowed" }}>
          <FaCheck style={{ marginRight: 6 }} /> Completed
        </button>
      );
    }
    return (
      <button
        className="btn-complete-sub"
        onClick={() => handleMarkComplete(itemId, itemType)}
        disabled={submittingProgress}
      >
        {submittingProgress ? <><FaSpinner className="spin-icon" style={{ marginRight: 6 }} />Recording...</> : "Mark Complete"}
      </button>
    );
  };

  const getProgressVal = () => {
    if (!enrollment) return 0;
    return enrollment.progress !== undefined ? enrollment.progress : 0;
  };

  const progress = getProgressVal();

  const isCertificateUnlocked = () => {
    const allTutsDone = tutorials.every((t) => isCompleted(t._id, "tutorial"));
    const allVidsDone = videos.every((v) => isCompleted(v._id, "video"));
    const allAsmsDone = assignments.every((a) => isCompleted(a._id, "assignment"));
    const allQuizzesDone = quizzes.every((q) => {
      const quizId = q._id;
      const userId = user?._id || user?.email || "guest";
      const savedAttemptStr = localStorage.getItem(`${userId}_${quizId}`);
      if (savedAttemptStr) {
        const attempt = JSON.parse(savedAttemptStr);
        return attempt.passed;
      }
      return isCompleted(quizId, "quiz");
    });
    const finalDone = finalAssignments.every((f) => isCompleted(f._id, "final-assignment"));

    return allTutsDone && allVidsDone && allAsmsDone && allQuizzesDone && finalDone && progress === 100;
  };

  const isUnlocked = isCertificateUnlocked();

  const getFlatSequence = () => {
    const list = [];
    tutorials.forEach((item) => list.push({ type: "tutorial", data: item }));
    videos.forEach((item) => list.push({ type: "video", data: item }));
    assignments.forEach((item) => list.push({ type: "assignment", data: item }));
    quizzes.forEach((item) => list.push({ type: "quiz", data: item }));
    finalAssignments.forEach((item) => list.push({ type: "final-assignment", data: item }));
    return list;
  };

  const hasNextItem = () => {
    if (!activeItem) return false;
    const seq = getFlatSequence();
    const idx = seq.findIndex((item) => item.type === activeItem.type && item.data._id === activeItem.data._id);
    return idx !== -1 && idx < seq.length - 1;
  };

  const handleNextItem = () => {
    if (!activeItem) return;
    const seq = getFlatSequence();
    const idx = seq.findIndex((item) => item.type === activeItem.type && item.data._id === activeItem.data._id);
    if (idx !== -1 && idx < seq.length - 1) {
      setActiveItem(seq[idx + 1]);
    }
  };

  if (loading) {
    return (
      <div className="player-loading">
        <div className="lms-spinner"></div>
        <p>Loading course player...</p>
      </div>
    );
  }

  return (
    <div className="lms-player-container">
      {/* Left Panel: Syllabus Sidebar */}
      <aside className="player-sidebar-wrapper">

        {/* ── STICKY HEADER: Brand + Course Name + Progress ── */}
        <div className="sidebar-header">
          <div className="sidebar-brand-strip">
            <div className="sidebar-brand-icon">L</div>
            <span className="sidebar-brand-label">LernX</span>
          </div>

          <h3 className="course-sidebar-title">{cleanCourseName(course?.name, course?.description)}</h3>

          <div className="sidebar-progress-wrap">
            <div className="sidebar-progress-ring-area">
              <svg className="progress-ring-svg" viewBox="0 0 56 56">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="28" cy="28" r="22" className="ring-track" />
                <circle
                  cx="28" cy="28" r="22"
                  className="ring-fill"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                />
              </svg>
              <span className="ring-percent">{progress}%</span>
            </div>
            <div className="sidebar-progress-text-col">
              <span className="sidebar-progress-label">Course Progress</span>
              <div className="sidebar-progress-bar-track">
                <div className="sidebar-progress-bar-fill" style={{ width: `${Math.max(progress, 0)}%` }} />
              </div>
              <span className="sidebar-progress-sublabel">
                {progress === 100 ? '🎉 Completed!' : progress > 0 ? `${progress}% done — keep going!` : 'Just started'}
              </span>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE BODY: Nav + Footer ── */}
        <div className="sidebar-scroll-body">
          <nav className="sidebar-syllabus">
            {/* Tutorials Section */}
            <div className="module-accordion">
              <button className="module-trigger" onClick={() => toggleSection("tutorials")}>
                <span className="module-title">
                  <FaBookOpen className="section-icon" />
                  Tutorials
                </span>
                <span className="module-chevron">
                  {sectionsExpanded.tutorials ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                </span>
              </button>
              {sectionsExpanded.tutorials && (
                <ul className="submodule-list">
                  {normalizeArray(tutorials).map((tut) => {
                    const isSelected = activeItem?.type === "tutorial" && activeItem.data._id === tut._id;
                    const done = isCompleted(tut._id, "tutorial");
                    return (
                      <li key={tut._id}>
                        <button
                          className={`submodule-item-row ${isSelected ? "active" : ""} ${done ? "completed" : ""}`}
                          onClick={() => setActiveItem({ type: "tutorial", data: tut })}
                        >
                          <span className={`icon-prefix ${done ? "completed-tick" : ""}`}>
                            {done ? <FaCheckCircle /> : isSelected ? <FaArrowRight size={10} /> : <span className="dot-bullet" />}
                          </span>
                          <span className="item-text">{tut.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Videos Section */}
            <div className="module-accordion">
              <button className="module-trigger" onClick={() => toggleSection("videos")}>
                <span className="module-title">
                  <FaVideo className="section-icon" />
                  Videos
                </span>
                <span className="module-chevron">
                  {sectionsExpanded.videos ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                </span>
              </button>
              {sectionsExpanded.videos && (
                <ul className="submodule-list">
                  {videos.length === 0 ? (
                    <li className="empty-submodules" style={{ padding: "0.65rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>No videos available</li>
                  ) : (
                    normalizeArray(videos).map((vid) => {
                      const isSelected = activeItem?.type === "video" && activeItem.data._id === vid._id;
                      const done = isCompleted(vid._id, "video");
                      return (
                        <li key={vid._id}>
                          <button
                            className={`submodule-item-row ${isSelected ? "active" : ""} ${done ? "completed" : ""}`}
                            onClick={() => setActiveItem({ type: "video", data: vid })}
                          >
                            <span className={`icon-prefix ${done ? "completed-tick" : ""}`}>
                              {done ? <FaCheckCircle /> : <FaPlay size={9} />}
                            </span>
                            <span className="item-text">{vid.title}</span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>

            {/* Assignments Section */}
            <div className="module-accordion">
              <button className="module-trigger" onClick={() => toggleSection("assignments")}>
                <span className="module-title">
                  <FaClipboardList className="section-icon" />
                  Assignments
                </span>
                <span className="module-chevron">
                  {sectionsExpanded.assignments ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                </span>
              </button>
              {sectionsExpanded.assignments && (
                <ul className="submodule-list">
                  {assignments.length === 0 ? (
                    <li className="empty-submodules" style={{ padding: "0.65rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>No assignments available</li>
                  ) : (
                    normalizeArray(assignments).map((asm) => {
                      const isSelected = activeItem?.type === "assignment" && activeItem.data._id === asm._id;
                      const done = isCompleted(asm._id, "assignment");
                      return (
                        <li key={asm._id}>
                          <button
                            className={`submodule-item-row ${isSelected ? "active" : ""} ${done ? "completed" : ""}`}
                            onClick={() => setActiveItem({ type: "assignment", data: asm })}
                          >
                            <span className={`icon-prefix ${done ? "completed-tick" : ""}`}>
                              {done ? <FaCheckCircle /> : <FaClipboardList size={11} />}
                            </span>
                            <span className="item-text">{asm.title}</span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>

            {/* Quizzes Section */}
            <div className="module-accordion">
              <button className="module-trigger" onClick={() => toggleSection("quizzes")}>
                <span className="module-title">
                  <FaQuestionCircle className="section-icon" />
                  Quizzes
                </span>
                <span className="module-chevron">
                  {sectionsExpanded.quizzes ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                </span>
              </button>
              {sectionsExpanded.quizzes && (
                <ul className="submodule-list">
                  {quizzes.length === 0 ? (
                    <li className="empty-submodules" style={{ padding: "0.65rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>No quizzes available</li>
                  ) : (
                    normalizeArray(quizzes).map((qz) => {
                      const isSelected = activeItem?.type === "quiz" && activeItem.data._id === qz._id;
                      const done = isCompleted(qz._id, "quiz");
                      return (
                        <li key={qz._id}>
                          <button
                            className={`submodule-item-row ${isSelected ? "active" : ""} ${done ? "completed" : ""}`}
                            onClick={() => setActiveItem({ type: "quiz", data: qz })}
                          >
                            <span className={`icon-prefix ${done ? "completed-tick" : ""}`}>
                              {done ? <FaCheckCircle /> : <FaQuestionCircle size={11} />}
                            </span>
                            <span className="item-text">{qz.title || qz.name || "Quiz"}</span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>

            {/* Final Assignment Section */}
            <div className="module-accordion">
              <button className="module-trigger" onClick={() => toggleSection("finalAssignment")}>
                <span className="module-title">
                  <FaClipboardList className="section-icon" />
                  Final Assignment
                </span>
                <span className="module-chevron">
                  {sectionsExpanded.finalAssignment ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                </span>
              </button>
              {sectionsExpanded.finalAssignment && (
                <ul className="submodule-list">
                  {finalAssignments.length === 0 ? (
                    <li className="empty-submodules" style={{ padding: "0.65rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>No final assignment available</li>
                  ) : (
                    normalizeArray(finalAssignments).map((final) => {
                      const isSelected = activeItem?.type === "final-assignment" && activeItem.data._id === final._id;
                      const done = isCompleted(final._id, "final-assignment");
                      return (
                        <li key={final._id}>
                          <button
                            className={`submodule-item-row ${isSelected ? "active" : ""} ${done ? "completed" : ""}`}
                            onClick={() => setActiveItem({ type: "final-assignment", data: final })}
                          >
                            <span className={`icon-prefix ${done ? "completed-tick" : ""}`}>
                              {done ? <FaCheckCircle /> : <FaClipboardList size={11} />}
                            </span>
                            <span className="item-text">{final.title || final.name || "Final Task"}</span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>

            {/* Certificate row */}
            <div className="sidebar-certificate-row">
              {!isUnlocked ? (
                <div className="certificate-item locked" title="Complete all course requirements to unlock">
                  <span className="icon-prefix"><FaLock size={13} /></span>
                  <span className="item-text">Complete all to unlock certificate</span>
                </div>
              ) : certificateData ? (
                <button
                  className={`certificate-item unlocked ${activeItem?.type === "certificate" ? "active" : ""}`}
                  onClick={() => setActiveItem({ type: "certificate", data: certificateData })}
                >
                  <span className="icon-prefix"><FaTrophy size={14} /></span>
                  <span className="item-text">View Certificate</span>
                </button>
              ) : (
                <button
                  className={`certificate-item unlocked claimable ${activeItem?.type === "certificate-form" ? "active" : ""}`}
                  onClick={() => setActiveItem({ type: "certificate-form", data: {} })}
                  disabled={submittingProgress}
                >
                  <span className="icon-prefix"><FaTrophy size={14} /></span>
                  <span className="item-text">Generate Certificate</span>
                </button>
              )}
            </div>
          </nav>

          <div className="sidebar-footer">
            <button className="btn-leave-player" onClick={() => navigate(`/course/${courseId}`)}>
              <FaArrowLeft style={{ marginRight: 6 }} /> Leave Player
            </button>
          </div>
        </div>
      </aside>

      {/* Right Panel: Content viewport area */}
      <main className="player-content-area">

        {/* Content Viewport */}
        <div className="player-viewport">
          {activeItem ? (
            <div className="submodule-content-card">
              {/* Render Tutorials View */}
              {activeItem.type === "tutorial" && (
                <div className="submodule-detail-body">
                  <div className="submodule-header">
                    <span className="current-node-tag"><FaBookOpen style={{marginRight:5}} />Tutorial</span>
                    <h1>{activeItem.data.name}</h1>
                  </div>
                  <div className="tab-viewport-body">
                    <div className="tutorial-markup">
                      <h3>Lesson Walkthrough</h3>
                      <p>
                        {safeRender(
                          activeItem.data.content ||
                          activeItem.data.description ||
                          (() => {
                            const fb = getFallbackContent(course?.title || course?.name || "", courseId);
                            const fbSub = fb.subModules?.find(s => s.name === activeItem.data.name);
                            return fbSub?.content || "";
                          })()
                        )}
                      </p>
                      <div className="tutorial-box">
                        <FaLightbulb style={{color:'#f59e0b', marginRight:6, flexShrink:0}} />
                        <strong>Learnexa Tip:</strong> Try recreating concepts and commands covered in these materials locally in your environment.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Render Video View */}
              {activeItem.type === "video" && (() => {
                const currentTopic = tutorials.find(t => t._id === activeItem.data.subModuleId) || {};
                const topicTitle = currentTopic.name || currentTopic.title || activeItem.data.title;
                return (
                  <div className="submodule-detail-body">
                    <div className="submodule-header">
                      <span className="current-node-tag">🎥 Video Lesson</span>
                      <h1>{topicTitle}</h1>
                      <div className="video-meta">Duration: {activeItem.data.duration || "N/A"}</div>
                    </div>
                    <div className="tab-viewport-body">
                      <div className="video-player-frame">
                        <iframe
                          className="html5-video-player"
                          src={getVideoEmbedUrl(activeItem.data, currentTopic, course?.title || "")}
                          title={topicTitle}
                          allowFullScreen
                          border="0"
                        ></iframe>
                      </div>
                      <p className="video-description-text" style={{ marginTop: "1rem", color: "#4b5563" }}>
                        {activeItem.data.description || "Watch the video presentation fully before checking completions."}
                      </p>
                      
                      {/* --- NOTES SECTION --- */}
                      <div className="notes-section" style={{ marginTop: "2rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FaClipboardList /> My Notes & Doubts
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Type your notes or doubts here..."
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px", color: "#333", backgroundColor: "#fff" }}
                          ></textarea>
                          <button 
                            className="btn-complete-sub" 
                            onClick={() => handleSaveNote(activeItem.data._id)}
                            disabled={isSavingNote}
                            style={{ alignSelf: "flex-end" }}
                          >
                            {isSavingNote ? "Saving..." : "Save Note"}
                          </button>
                        </div>
                        {videoNotes && videoNotes.length > 0 && (
                          <div style={{ marginTop: "1.5rem" }}>
                            <h4 style={{ fontSize: "0.95rem", marginBottom: "0.75rem", color: "#475569" }}>Previous Notes</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              {videoNotes.map((note, idx) => (
                                <div key={idx} style={{ padding: "0.75rem", background: "#fff", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem", color: "#333" }}>
                                  {note.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </div>
                  </div>
                );
              })()}

              {/* Render Assignment View */}
              {activeItem.type === "assignment" && (
                <div className="submodule-detail-body">
                  <div className="submodule-header">
                    <span className="current-node-tag">📝 Assignment</span>
                    <h1>{activeItem.data.title}</h1>
                    <div className="video-meta">Max Marks: {activeItem.data.maxMarks || 100}</div>
                  </div>
                  <div className="tab-viewport-body">
                    <div className="assignment-card-item" style={{ marginBottom: "1.5rem" }}>
                      <p className="asm-desc">{activeItem.data.description}</p>
                    </div>

                    {isCompleted(activeItem.data._id, "assignment") ? (
                      <div className="completed-success-banner" style={{ marginTop: "1.5rem" }}>
                        <span className="success-icon">✓</span>
                        <span>Assignment submitted successfully! Marked as complete.</span>
                      </div>
                    ) : (
                      <div className="assignment-submission-form" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1f2937", margin: 0 }}>Submit Your Work</h3>
                        
                        <div className="form-group">
                          <label style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4b5563" }}>Option A: Write your answer here...</label>
                          <textarea
                            className="answer-area"
                            placeholder="Type your answer or submission notes here..."
                            rows="5"
                            value={asmText}
                            onChange={(e) => setAsmText(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                          ></textarea>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.5rem 0", color: "#9ca3af", fontSize: "0.85rem", fontWeight: "600" }}>
                          <span style={{ background: "#ffffff", padding: "0 0.5rem", position: "relative", zIndex: 1 }}>OR</span>
                          <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", width: "100%", position: "absolute", zIndex: 0 }} />
                        </div>

                        <div className="form-group">
                          <label style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4b5563" }}>Option B: Paste Google Drive link</label>
                          <input
                            type="url"
                            className="form-input"
                            placeholder="https://drive.google.com/..."
                            value={asmLink}
                            onChange={(e) => setAsmLink(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                          />
                        </div>

                        <div style={{ color: "#9ca3af", fontSize: "0.85rem", fontWeight: "600", alignSelf: "center" }}>OR</div>

                        <div className="form-group">
                          <label style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4b5563" }}>Upload File</label>
                          <input
                            type="file"
                            className="form-input"
                            accept=".pdf,.zip,.rar,.txt"
                            onChange={(e) => setAsmFile(e.target.files[0])}
                            style={{ marginTop: "0.25rem" }}
                          />
                          {asmFile && (
                            <span style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.25rem" }}>
                              Selected file: {asmFile.name}
                            </span>
                          )}
                        </div>

                        <button
                          className="btn-complete-sub"
                          onClick={handleSubmitAssignment}
                          disabled={submittingProgress}
                          style={{ marginTop: "1rem", alignSelf: "flex-end" }}
                        >
                          {submittingProgress ? "Submitting..." : "Submit Assignment"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Render Quiz View */}
              {activeItem.type === "quiz" && (
                <div className="submodule-detail-body">
                  <div className="submodule-header">
                    <span className="current-node-tag"><FaQuestionCircle style={{marginRight:5}} />Module Quiz</span>
                    <h1>{activeItem.data.title || "Topic assessment"}</h1>
                  </div>
                  <div className="tab-viewport-body">
                    {quizAttempt && !isReattempting ? (
                      <div className="quiz-result-dashboard" style={{ display: "flex", justifyContent: "center" }}>
                        <div className="scorecard-card" style={{ border: quizAttempt.passed ? "2px solid #10b981" : "2px solid #ef4444", borderRadius: "12px", padding: "2rem", backgroundColor: "#ffffff", width: "100%", maxWidth: "500px", textAlign: "center" }}>
                          <h3 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "1.5rem" }}>Quiz Results</h3>
                          <div style={{ textAlign: "left", margin: "1rem auto", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "280px" }}>
                            <div>Total Questions: <strong>{quizAttempt.total}</strong></div>
                            <div>Correct Answers: <strong>{quizAttempt.score}</strong></div>
                            <div>Your Score: <strong>{quizAttempt.score}/{quizAttempt.total}</strong></div>
                            <div>Percentage: <strong>{quizAttempt.percentage}%</strong></div>
                          </div>
                          <div className={`quiz-status-msg ${quizAttempt.passed ? "pass" : "fail"}`} style={{ color: quizAttempt.passed ? "#10b981" : "#ef4444", fontWeight: "800", margin: "1.5rem 0", fontSize: "1.25rem" }}>
                            {quizAttempt.passed ? "✓ Quiz Passed" : "✗ Try Again"}
                          </div>
                          <button
                            className="btn-reattempt-quiz"
                            onClick={() => setIsReattempting(true)}
                            style={{ marginTop: "1rem" }}
                          >
                            Reattempt Quiz
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {activeItem.data.questions && activeItem.data.questions.length > 0 ? (
                          activeItem.data.questions.map((q, qIndex) => (
                            <div className="quiz-card" key={qIndex} style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                              <h4 style={{ marginBottom: "0.75rem" }}>{qIndex + 1}. {q.question}</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {q.options?.map((opt, oIndex) => (
                                  <label key={oIndex} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                    <input
                                      type="radio"
                                      name={`quiz-${activeItem.data._id}-${qIndex}`}
                                      value={opt}
                                      checked={quizAnswers[`${activeItem.data._id}-${qIndex}`] === opt}
                                      onChange={() =>
                                        setQuizAnswers((prev) => ({
                                          ...prev,
                                          [`${activeItem.data._id}-${qIndex}`]: opt,
                                        }))
                                      }
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No questions configured for this quiz.</p>
                        )}
                        {activeItem.data.questions && activeItem.data.questions.length > 0 && (
                          <div className="content-item-action-row" style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                            <button
                              className="btn-complete-sub"
                              onClick={handleSubmitQuiz}
                            >
                              Submit Quiz
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Render Final Assignment View */}
              {activeItem.type === "final-assignment" && (
                <div className="submodule-detail-body">
                  <div className="submodule-header">
                    <span className="current-node-tag"><FaTrophy style={{marginRight:5}} />Final Course Assessment</span>
                    <h1>{activeItem.data.title || activeItem.data.name || "Final Exam"}</h1>
                    {activeItem.data.maxMarks && (
                      <div className="video-meta">Max Marks: {activeItem.data.maxMarks}</div>
                    )}
                  </div>
                  <div className="tab-viewport-body">
                    <div className="assignment-card-item">
                      <p className="asm-desc">
                        {activeItem.data.description ||
                          "Complete the final verification project to earn your Learnexa digital completion certificate."}
                      </p>
                    </div>
                    {isCompleted(activeItem.data._id, "final-assignment") || submittedFinal ? (
                      <div className="completed-success-banner" style={{ marginTop: "1.5rem" }}>
                        <span className="success-icon">✓</span>
                        <span>Assignment submitted successfully! Your progress is now complete. Go to the sidebar to generate your certificate.</span>
                      </div>
                    ) : (
                      <>
                        <div className="assignment-upload-area" style={{ marginTop: "1.5rem" }}>
                          <div className="form-group" style={{ marginBottom: "1rem" }}>
                            <label style={{ fontWeight: "600" }}>Google Drive / Submission Link</label>
                            <input
                              type="url"
                              className="form-input"
                              placeholder="Paste your Google Drive link or project repository URL here..."
                              value={submissionLink}
                              onChange={(e) => setSubmissionLink(e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                            <label style={{ fontWeight: "600" }}>Upload Submission File (ZIP/PDF)</label>
                            <input
                              type="file"
                              className="form-input"
                              accept=".pdf,.zip,.rar"
                              onChange={(e) => setSubmissionFile(e.target.files[0])}
                              style={{ marginTop: "0.25rem" }}
                            />
                            {submissionFile && (
                              <span style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.25rem" }}>
                                Selected file: {submissionFile.name}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="content-item-action-row" style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                          <button
                            className="btn-complete-sub"
                            onClick={handleSubmitFinalAssignment}
                            disabled={submittingProgress}
                          >
                            {submittingProgress ? "Submitting..." : "Submit Final Assignment"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Render Certificate View */}
              {activeItem.type === "certificate" && (
                <div className="submodule-detail-body">
                  <div className="submodule-header">
                    <span className="current-node-tag"><FaTrophy style={{marginRight:5}} />Learnexa Digital Credential</span>
                    <h1>Verification Code: {activeItem.data._id}</h1>
                  </div>
                  <div className="tab-viewport-body" style={{ textAlign: "center", padding: "2rem" }}>
                    <p style={{ color: "#475569", marginBottom: "1.5rem" }}>
                      Congratulations! You have completed all syllabus coordinates for this course.
                    </p>
                    <button
                      className="btn-primary-action btn-continue"
                      onClick={() => navigate("/certificate", { state: { cert: activeItem.data, course } })}
                      style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}
                    >
                      View Certificate Page
                    </button>
                  </div>
                </div>
              )}

              {/* Render Certificate Form View */}
              {activeItem.type === "certificate-form" && (
                <div className="submodule-detail-body">
                  <div className="certificate-generation-form-card">
                    <h2><FaTrophy style={{marginRight:8, color:'#f59e0b'}} />Request Digital Certificate</h2>
                    
                    {certificateData ? (
                      <div className="success-message" style={{ textAlign: "center", padding: "1.5rem" }}>
                        <p style={{ color: "#10b981", fontWeight: "600", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                          ✓ Certificate successfully generated!
                        </p>
                        <button
                          className="btn-primary-action btn-continue"
                          onClick={() => {
                            const cleanedCourse = { ...course, name: cleanCourseName(course?.name, course?.description) };
                            navigate("/certificate/preview", { state: { cert: certificateData, course: cleanedCourse } });
                          }}
                          style={{ padding: "0.85rem 2rem", fontSize: "1rem", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                        >
                          View Certificate
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>Enter your academic coordinates to generate your verified digital completion credential.</p>
                        
                        <form onSubmit={handleFormGenerateCert}>
                      <div className="form-group">
                        <label>Student Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Shashank Kumar"
                          value={certFormName}
                          onChange={(e) => setCertFormName(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>College / Institution Name</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Stanford University"
                          value={certFormCollege}
                          onChange={(e) => setCertFormCollege(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Graduation Year</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. 2026"
                          value={certFormYear}
                          onChange={(e) => setCertFormYear(e.target.value)}
                        />
                      </div>

                       <div className="form-group">
                        <label>Course</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cleanCourseName(course?.name, course?.description) || ""}
                          disabled
                          style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-submit-cert"
                        disabled={submittingProgress}
                      >
                        {submittingProgress ? "Generating Certificate..." : "Generate Digital Certificate"}
                      </button>
                    </form>
                    </>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Navigation Bar */}
              {activeItem.type !== "certificate" && activeItem.type !== "certificate-form" && (
                <div className="player-bottom-navigation-bar">
                  <button className="btn-player-back-nav" onClick={() => navigate(`/course/${courseId}`)}>
                    ← Back to Course Details
                  </button>
                  
                  <div className="player-nav-right-buttons">
                    {activeItem.type !== "quiz" && activeItem.type !== "final-assignment" && renderMarkCompleteBtn(activeItem.data._id, activeItem.type)}
                    
                    {hasNextItem() && (
                      <button className="btn-player-next" onClick={handleNextItem}>
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="player-welcome-panel">
              <div className="welcome-player-card">
                <div className="welcome-icon">⚡</div>
                <h1>Welcome to {cleanCourseName(course?.name, course?.description) || "Learnexa Platform"}</h1>
                <p>Select any item from the roadmap sidebar to start learning.</p>
                <div className="welcome-prog-box">
                  <span>Course Completed:</span>
                  <strong>{progress}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showCongrats && (
        <div className="congrats-modal-overlay">
          <div className="congrats-modal-card">
            <span className="congrats-emoji">🎉</span>
            <h2>Congratulations!</h2>
            <p>You have successfully completed</p>
            <h3>{cleanCourseName(course?.name, course?.description)}</h3>
            <p style={{ fontWeight: "600", color: "#4f46e5", margin: "0.5rem 0 1.5rem 0", fontSize: "1.1rem" }}>Progress: 100%</p>
            <button
              className="btn-congrats-generate-cert"
              onClick={() => {
                setShowCongrats(false);
                setActiveItem({ type: "certificate-form" });
              }}
            >
              Generate Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
