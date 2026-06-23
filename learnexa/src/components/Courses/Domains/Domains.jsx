import React,{useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import "./Domains.css";


const API =
"https://brillon-tasks-1.onrender.com/api/v1";


function Domains(){


const {categoryId}=useParams();

const navigate=useNavigate();


const [domains,setDomains]=useState([]);

const [loading,setLoading]=useState(true);





const extractArray=(data)=>{


console.log("DOMAINS API",data);


if(Array.isArray(data))
return data;


if(Array.isArray(data.domains))
return data.domains;


if(Array.isArray(data.data))
return data.data;


if(Array.isArray(data.data?.domains))
return data.data.domains;


return [];

};






useEffect(()=>{


const getDomains=async()=>{


try{


const token =
localStorage.getItem("token")
||
localStorage.getItem("userToken");



const res =
await fetch(

`${API}/hierarchy/domains?categoryId=${categoryId}`,

{
headers:{
Authorization:`Bearer ${token}`
}
}

);



const data =
await res.json();



setDomains(
extractArray(data)
);



}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}


};



getDomains();


},[categoryId]);









if(loading)

return <h1>Loading...</h1>;








return(

<div className="domains-page">


<h1 className="domains-heading">

Domains

</h1>




<div className="domains-container">



{


domains.length>0 ?

domains.map(domain=>(



<div

className="domain-card"

key={domain._id}

>


<img

src={
domain.image ||
"https://images.unsplash.com/photo-1498050108023-c5249f4df085"
}

/>





<div className="domain-content">


<span>

DOMAIN

</span>



<h2>

{domain.name}

</h2>



<p>

{
domain.description ||
"Explore learning tracks"
}

</p>





<button

onClick={()=>navigate(
`/tracks/${domain._id}`
)}

>

View Tracks

</button>




</div>


</div>



))


:

<h2>No Domains Found</h2>


}




</div>



</div>

);


}


export default Domains;