import axios from "axios";

const BASE_URL = "https://brillon-tasks-1.onrender.com/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ================= COURSE =================

export const getCourse = async (courseId) => {
  const res = await API.get(
    `/content/courses`
  );

  const courses = res.data.data || res.data;

  return courses.find(
    (c) => c._id === courseId
  );
};


// ================= MODULES =================

export const getModules = async (courseId) => {

  const res = await API.get(
    `/content/modules?courseId=${courseId}`
  );

  return res.data.data || [];
};



// ================= SUB MODULES =================

export const getSubModules = async (moduleId) => {

  const res = await API.get(
    `/content/sub-modules?moduleId=${moduleId}`
  );

  return res.data.data || [];
};



// ================= VIDEOS =================

export const getVideos = async (subModuleId) => {

  const res = await API.get(
    `/content/videos?subModuleId=${subModuleId}`
  );

  return res.data.data || [];
};



// ================= ASSIGNMENTS =================

export const getAssignments = async (moduleId) => {

  const res = await API.get(
    `/content/assignments?moduleId=${moduleId}`
  );

  return res.data.data || [];
};



// ================= ENROLLMENTS =================


export const getMyEnrollments = async () => {

  const res = await API.get(
    "/enrollments/me"
  );

  return res.data.data || [];
};




export const updateProgress = async (
  enrollmentId,
  subModuleId
)=>{


 const res = await API.put(
    `/enrollments/${enrollmentId}/progress`,
    {
      subModuleId: subModuleId
    }
 );


 return res.data;

};