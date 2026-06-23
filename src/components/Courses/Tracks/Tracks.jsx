import React,{useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import "./Tracks.css";


const API =
"https://brillon-tasks-1.onrender.com/api/v1";


function Tracks(){


const {domainId}=useParams();

const navigate=useNavigate();


const [tracks,setTracks]=useState([]);

const [loading,setLoading]=useState(true);





const extractArray=(data)=>{


console.log("TRACK API",data);



if(Array.isArray(data))
return data;


if(Array.isArray(data.tracks))
return data.tracks;


if(Array.isArray(data.data))
return data.data;


if(Array.isArray(data.data?.tracks))
return data.data.tracks;


return [];


};







useEffect(()=>{


const getTracks=async()=>{


try{


const token =
localStorage.getItem("token")
||
localStorage.getItem("userToken");



const res =
await fetch(

`${API}/hierarchy/tracks?domainId=${domainId}`,

{
headers:{
Authorization:`Bearer ${token}`
}
}

);



const data =
await res.json();



setTracks(
extractArray(data)
);



}


catch(error){

console.log(error);

}


finally{

setLoading(false);

}


};




getTracks();



},[domainId]);








if(loading)

return <h1>Loading...</h1>;








return(

<div className="tracks-page">



<h1 className="tracks-heading">

Learning Tracks

</h1>





<div className="tracks-container">


{


tracks.length>0 ?


tracks.map(track=>(


<div

className="track-card"

key={track._id}

>


<img

src={
track.image ||
"https://images.unsplash.com/photo-1498050108023-c5249f4df085"
}

/>




<div className="track-content">


<span>

TRACK

</span>




<h2>

{track.name}

</h2>





<p>

{
track.description ||
"Explore available courses"
}

</p>






<button

onClick={()=>navigate(

`/course-content/${track._id}`

)}

>

View Courses

</button>





</div>


</div>



))


:


<h2>No Tracks Found</h2>


}




</div>



</div>


);


}


export default Tracks;