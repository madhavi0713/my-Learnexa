import axios from "axios";


const API = axios.create({

  baseURL:
    "https://brillon-tasks-1.onrender.com/api/v1",

  headers: {

    "Content-Type":
      "application/json",

  },

  timeout: 15000,


});





/* ============ REQUEST INTERCEPTOR ============ */


API.interceptors.request.use(


(req)=>{


  // Don't attach JWT for public email verification

  if(
    req.url &&
    req.url.includes(
      "/user/verify-email"
    )
  ){

    console.log(
      "Public API:",
      req.url
    );


    return req;

  }





  const token =

    localStorage.getItem(
      "adminToken"
    )

    ||

    localStorage.getItem(
      "userToken"
    );





  if(token){


    req.headers.Authorization =

    `Bearer ${token}`;


  }





  console.log(

    "API Request:",

    req.method,

    req.url

  );




  return req;



},



(error)=>{


return Promise.reject(error);


}


);






/* ============ RESPONSE INTERCEPTOR ============ */


API.interceptors.response.use(



(response)=>{


console.log(

"API Response:",

response.data

);


return response;


},




(error)=>{



console.log(

"API Error:",

error.response?.data ||

error.message

);




return Promise.reject(error);



}



);




export default API;