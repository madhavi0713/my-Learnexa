import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Departments.css";


const API =
"https://brillon-tasks-1.onrender.com/api/v1";


const Departments=()=>{


const navigate=useNavigate();


const [departments,setDepartments]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

fetchDepartments();

},[]);





const fetchDepartments=async()=>{


try{


const token =
localStorage.getItem("token")
||
localStorage.getItem("userToken");



const res =
await fetch(

`${API}/hierarchy/departments`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



const data =
await res.json();



console.log(
"DEPARTMENTS",
data
);





let list=[];




if(Array.isArray(data)){

list=data;

}


else if(Array.isArray(data.departments)){

list=data.departments;

}


else if(Array.isArray(data.data)){

list=data.data;

}


else if(Array.isArray(data.data?.departments)){

list=data.data.departments;

}



setDepartments(list);



}


catch(err){

console.log(err);

setDepartments([]);

}


finally{

setLoading(false);

}


};










const getName=(dept)=>{


return (

dept.name ||

dept.departmentName ||

dept.title ||

"Department"

);


};







const getImage=(dept)=>{


let name =
getName(dept).toLowerCase();



if(name.includes("non")){


return "https://images.unsplash.com/photo-1552664730-d307ca884978";


}



return "https://images.unsplash.com/photo-1498050108023-c5249f4df085";


};










if(loading){


return <h2>Loading...</h2>


}










return(

<div className="department-page">



<h1 className="department-heading">

Departments

</h1>







<div className="department-container">





{

departments.map((dept)=>(



<div

className="department-card"

key={dept._id}

>






<img

src={getImage(dept)}

alt={getName(dept)}

/>







<div className="department-content">






<span className="dept-badge">

DEPARTMENT

</span>








<h2>

{getName(dept)}

</h2>








<p>

{

dept.description ||

"Explore available courses"

}

</p>








<button

onClick={()=>navigate(

`/categories/${dept._id}`

)}

>


View Categories


</button>







</div>






</div>



))

}





</div>






</div>

);


};



export default Departments;