import React,{useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import { normalizeArray, safeRender } from "../../../utils/normalizeArray";
import "./CourseContent.css";


const API =
"https://brillon-tasks-1.onrender.com/api/v1";


const CourseContent=()=>{


const {trackId}=useParams();

const navigate=useNavigate();


const [courses,setCourses]=useState([]);

const [loading,setLoading]=useState(true);




useEffect(()=>{

fetchCourses();

},[]);





const fetchCourses=async()=>{


try{


const token =
localStorage.getItem("token")
||
localStorage.getItem("userToken");




const res =
await fetch(

`${API}/content/courses`,

{
headers:{
Authorization:`Bearer ${token}`
}
}

);



const result =
await res.json();



console.log("COURSES API DATA",result);




let all=[];



if(Array.isArray(result)){

all=result;

}

else if(Array.isArray(result.data)){

all=result.data;

}

else if(Array.isArray(result.courses)){

all=result.courses;

}

else if(Array.isArray(result.data?.courses)){

all=result.data.courses;

}





console.log("ALL COURSES ARRAY",all);

console.log("CURRENT TRACK ID",trackId);





const filtered =
all.filter(course=>{


let courseTrack =


course.trackId?._id ||

course.trackId ||

course.track?._id ||

course.track ||

course.track_id ||

course.learningTrack ||

course.learningTrackId;



return String(courseTrack) === String(trackId);


});




console.log(
"FILTERED COURSES",
filtered
);





setCourses(filtered);



}

catch(err){

console.log(err);

setCourses([]);

}

finally{

setLoading(false);

}



};









const enrollCourse=async(id)=>{


try{


const token =
localStorage.getItem("token")
||
localStorage.getItem("userToken");



const res =
await fetch(

`${API}/enrollments`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},

body:JSON.stringify({

courseId:id

})

}

);




if(res.ok)

alert("Enrolled Successfully 🎉");

else

alert("Already enrolled / Failed");


}

catch(e){

console.log(e);

}


};







const img=(name="")=>{


name=name.toLowerCase();


if(name.includes("react"))

return "https://images.unsplash.com/photo-1633356122544-f134324a6cee";


if(name.includes("python"))

return "https://images.unsplash.com/photo-1526379095098-d400fd0bf935";


if(name.includes("java"))

return "https://images.unsplash.com/photo-1515879218367-8466d910aaa4";


return "https://images.unsplash.com/photo-1498050108023-c5249f4df085";


};







if(loading)

return <h1>Loading...</h1>;






return(

<div className="course-page">


<button

className="back-btn"

onClick={()=>navigate(-1)}

>

← Back

</button>




<h1 className="course-heading">

Course contents

</h1>






<div className="course-container">


{


courses.length>0 ?


normalizeArray(courses).map(course=>(



<div

className="course-card"

key={course._id}

>


<img

src={
course.image ||
img(course.name || course.title)
}

/>




<div className="course-content">


<span>COURSE</span>



<h2>

{course.name || course.title}

</h2>



<p>

{course.description}

</p>





<div className="course-actions">


<button

onClick={()=>navigate(

`/course-details/${course._id}`

)}

>

Details

</button>



<button

className="enroll"

onClick={()=>enrollCourse(course._id)}

>

Enroll

</button>


</div>


</div>


</div>


))


:


<h2>No Courses Found</h2>


}



</div>



</div>

);


};



export default CourseContent;