import React,{useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import "./Categories.css";


const API =
"https://brillon-tasks-1.onrender.com/api/v1";


function Categories(){


const {departmentId}=useParams();

const navigate=useNavigate();


const [categories,setCategories]=useState([]);

const [loading,setLoading]=useState(true);





const fixArray=(data)=>{


console.log("CATEGORY API",data);



if(Array.isArray(data))
return data;


if(Array.isArray(data.categories))
return data.categories;


if(Array.isArray(data.data))
return data.data;


if(Array.isArray(data.data?.categories))
return data.data.categories;


return [];

};






useEffect(()=>{


const getCategories=async()=>{


try{


const token =
localStorage.getItem("token")
||
localStorage.getItem("userToken");



const res =
await fetch(

`${API}/hierarchy/categories?departmentId=${departmentId}`,

{
headers:{
Authorization:`Bearer ${token}`
}
}

);



const data =
await res.json();



setCategories(
fixArray(data)
);



}


catch(err){

console.log(err);

}


finally{

setLoading(false);

}


};



getCategories();



},[departmentId]);








if(loading)

return <h1>Loading...</h1>;







return(

<div className="categories-page">


<h1 className="categories-heading">

Categories

</h1>





<div className="categories-container">


{

categories.length>0 ?

categories.map(cat=>(


<div

className="category-card"

key={cat._id}

>


<img

src={
cat.image ||
"https://images.unsplash.com/photo-1498050108023-c5249f4df085"
}

alt="category"

/>




<div className="category-content">


<span>

CATEGORY

</span>



<h2>

{cat.name}

</h2>



<p>

{
cat.description ||
"Explore domains"
}

</p>




<button

onClick={()=>navigate(
`/domains/${cat._id}`
)}

>

View Domains

</button>



</div>



</div>


))

:

<h2>No Categories Found</h2>


}


</div>


</div>

);



}


export default Categories;