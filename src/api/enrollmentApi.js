import apiClient from "./apiClient";

const cleanCourseName = (name, description) => {
  if (name === "HTML Complete Tutorial") return "HTML";
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

const getUserId = () => {
  const userStr = localStorage.getItem("loggedInUser");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user._id || user.email || "guest";
    } catch (e) {
      return "guest";
    }
  }
  return "guest";
};

export const getMyEnrollments = async () => {
  const response = await apiClient.get("/enrollments/me");
  const data = response.data.data || response.data || [];
  if (Array.isArray(data)) {
    const userId = getUserId();
    return data.map((enroll) => {
      const courseId = enroll.courseId?._id || enroll.courseId;
      if (!courseId) return enroll;

      // 1. Sync progress field name mismatch
      const baseProgress = enroll.progressPercentage !== undefined ? enroll.progressPercentage : (enroll.progress || 0);

      // 2. Fetch local storage completions
      const courseItemsStr = localStorage.getItem(`course_items_${courseId}`);
      const completedItemsStr = localStorage.getItem(`completed_items_${userId}_${courseId}`);

      let progressVal = baseProgress;
      let completedList = enroll.completedSubModules || [];

      if (courseItemsStr) {
        try {
          const courseItems = JSON.parse(courseItemsStr);
          const completedItems = completedItemsStr ? JSON.parse(completedItemsStr) : [];
          
          // Merge completed items
          completedList = Array.from(new Set([...completedList, ...completedItems]));
          
          if (courseItems.length > 0) {
            const completedCount = courseItems.filter(itemId => completedList.includes(itemId)).length;
            progressVal = Math.round((completedCount / courseItems.length) * 100);
          }
        } catch (e) {
          console.error("Failed to parse course items or completed items", e);
        }
      }

      const courseName = cleanCourseName(enroll.courseId?.name || enroll.courseId, enroll.courseId?.description);
      return {
        ...enroll,
        course: {
          name: courseName,
          title: courseName,
        },
        completedSubModules: completedList,
        progressPercentage: progressVal,
        progress: progressVal,
      };
    });
  }
  return data;
};

export const enrollInCourse = async (courseId) => {
  const response = await apiClient.post("/enrollments", { courseId });
  return response.data;
};

export const updateProgress = async (enrollmentId, subModuleId) => {
  const response = await apiClient.put(`/enrollments/${enrollmentId}/progress`, {
    subModuleId: subModuleId,
  });
  return response.data;
};

