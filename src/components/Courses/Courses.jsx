import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  FaCode, FaBriefcase, FaGlobe, FaChartLine, FaPaintBrush,
  FaHandshake, FaCloud, FaShieldAlt, FaFlask, FaRobot,
  FaKeyboard, FaBook, FaArrowRight
} from "react-icons/fa";
import "./Courses.css";
import "../../pages/Courses.css";


const BASE_URL =
"https://brillon-tasks-1.onrender.com/api/v1";



const Courses=({home})=>{


const navigate=useNavigate();


const [items,setItems]=useState([]);

const [level,setLevel]=useState("departments");

const [title,setTitle]=useState("Departments");

const [history,setHistory]=useState([]);

const [loading,setLoading]=useState(true);







// IMAGE
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

const getHierarchyDesc = (name = "", description = "") => {
  if (description) return description;
  const n = name.toLowerCase();
  if (n.includes("technical department")) return "Master coding languages, frameworks, AI databases, and modern cloud deployment protocols.";
  if (n.includes("non technical")) return "Hone key professional traits like team dynamics, business administration, and soft skills.";
  if (n.includes("web dev")) return "Explore responsive styling, client interfaces, server logic, and fullstack frameworks.";
  if (n.includes("data science")) return "Learn statistical modeling, regression models, big data frameworks, and analytics.";
  if (n.includes("artificial")) return "Master neural structures, automation algorithms, natural processing models, and deep learning.";
  return "Unlock structured learning pathways and career advancements in this category.";
};

// ================= API FIX =================


const extractArray=(data)=>{



console.log(
"API RESPONSE",
data
);




if(Array.isArray(data))

return data;




if(Array.isArray(data.data))

return data.data;




if(Array.isArray(data.data?.departments))

return data.data.departments;




if(Array.isArray(data.data?.categories))

return data.data.categories;




if(Array.isArray(data.data?.domains))

return data.data.domains;




if(Array.isArray(data.data?.tracks))

return data.data.tracks;




if(Array.isArray(data.data?.courses))

return data.data.courses;





if(Array.isArray(data.departments))

return data.departments;



if(Array.isArray(data.categories))

return data.categories;



if(Array.isArray(data.domains))

return data.domains;



if(Array.isArray(data.tracks))

return data.tracks;



if(Array.isArray(data.courses))

return data.courses;




return [];

};










const apiCall=async(url)=>{


const token=

localStorage.getItem("token")

||

localStorage.getItem("userToken");




const res=await fetch(

BASE_URL+url,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);




const data=await res.json();




return extractArray(data);



};











// FIRST LOAD


const loadDepartments=async()=>{


try{


setLoading(true);



const result=

await apiCall(

"/hierarchy/departments"

);



setItems(result);


setLevel("departments");


setTitle("Departments");



}


catch(e){

console.log(e);

}


finally{

setLoading(false);

}



};










useEffect(()=>{


loadDepartments();


// eslint-disable-next-line react-hooks/exhaustive-deps
},[]);











// CARD CLICK


const openItem=async(item)=>{


try{


setLoading(true);





setHistory([

...history,


{

items,

level,

title

}


]);







let result=[];







if(level==="departments"){



result=await apiCall(

`/hierarchy/categories?departmentId=${item._id}`

);


setLevel("categories");


}





else if(level==="categories"){



result=await apiCall(

`/hierarchy/domains?categoryId=${item._id}`

);


setLevel("domains");


}






else if(level==="domains"){



result=await apiCall(

`/content/courses?domainId=${item._id}`

);



setLevel("courses");


}






else if(level==="courses"){



navigate(

`/course-details/${item._id}`

);



return;


}








setItems(result);



setTitle(

item.name ||

item.title

);



}



catch(e){


console.log(e);


}


finally{


setLoading(false);


}



};










// BACK


const goBack=()=>{


const last=

history[history.length-1];



if(!last)

return;




setItems(last.items);

setLevel(last.level);

setTitle(last.title);



setHistory(

history.slice(0,-1)

);


};









if(loading)

return <h1>Loading...</h1>;











const list=

Array.isArray(items)

?

(home ? items.slice(0,3):items)

:

[];











return(


<div className="courses-section">





<h1 className="courses-title">

{title}

</h1>





{

history.length>0 &&


<button

className="view-more-btn"

onClick={goBack}

>

← Back

</button>


}








<div className="courses-container">





{
  list.length > 0 ? (
    <div className="hierarchy-cards-grid" style={{ width: "100%" }}>
      {list.map((item, index) => (
        <div key={item._id} className={`hierarchy-item-card dept-card-${index % 4}`} onClick={() => openItem(item)}>
          <div className="hierarchy-card-banner">
            <div className="hierarchy-card-icon-wrapper">
              {getHierarchyIcon(item.name || item.title)}
            </div>
            <div className="hierarchy-card-banner-glow" />
          </div>
          <div className="hierarchy-card-content">
            <span className="hierarchy-card-label">{level}</span>
            <h3 className="hierarchy-card-title">{item.name || item.title}</h3>
            <p className="hierarchy-card-desc">{getHierarchyDesc(item.name || item.title, item.description)}</p>
            <div className="hierarchy-card-action-outline">
              <span>{level === "courses" ? "View Details" : "Open"}</span>
              <FaArrowRight size={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (



<h2>

No Data Found

</h2>


)
}








</div>





</div>


);


};




export default Courses;