import React,{useState} from "react";
import { normalizeArray, safeRender } from "../../utils/normalizeArray";
import "./Sidebar.css";



const Sidebar=({

modules=[],

progress=0,

selected,

setSelected

})=>{



const [openModule,setOpenModule]=useState({});







const toggleModule=(id)=>{


setOpenModule({

...openModule,

[id]:!openModule[id]

});


};









const active=(item)=>{


return selected?.data?._id===item?._id;


};









return(


<div className="course-sidebar">








{/* ================= HEADER ================= */}


<div className="sidebar-header">


<h2>

Syllabus Roadmap

</h2>




<div className="progress-info">


<span>

Progress

</span>



<strong>

{progress}%

</strong>



</div>





<div className="sidebar-progress">


<div

style={{

width:`${progress}%`

}}


/>


</div>




</div>















{/* ================= MODULES ================= */}



<div className="sidebar-content">



<h3>

▼ Modules

</h3>








{

modules.length>0 ?

normalizeArray(modules).map((module,index)=>(




<div

className="module-wrapper"

key={module._id}

>








{/* MODULE TITLE */}



<button


className={

active(module)

?

"module-btn active"

:

"module-btn"

}



onClick={()=>{


toggleModule(module._id);


setSelected({

type:"module",

data:module

});


}}

>



<span>


{

openModule[module._id]

?

"▼"

:

"▶"

}


</span>




Module {index+1}: {


module.title ||

module.name ||

"Module"

}



</button>












{/* DROPDOWN */}


{

openModule[module._id] &&



<div className="module-items">









{/* ================= VIDEOS ================= */}



{

module.videos?.length>0 &&

<>


<p className="section-label">

🎥 Videos

</p>






{

normalizeArray(module.videos).map((video,i)=>(




<button


key={video._id}



className={

active(video)

?

"lesson-btn active"

:

"lesson-btn"

}



onClick={()=>setSelected({

type:"video",

data:video

})}


>


▶ {i+1}. {


video.title ||

video.name ||

"Video Lesson"

}


</button>




))


}



</>

}













{/* ================= ASSIGNMENTS ================= */}


{

module.assignments?.length>0 &&


<>


<p className="section-label">

📝 Assignments

</p>





{


normalizeArray(module.assignments).map((a,i)=>(



<button


key={a._id}


className={

active(a)

?

"lesson-btn active"

:

"lesson-btn"

}


onClick={()=>setSelected({

type:"assignment",

data:a

})}

>



📝 {i+1}. {


a.title ||

a.name ||

"Assignment"

}



</button>



))


}



</>

}















{/* ================= QUIZZES ================= */}



{

module.quizzes?.length>0 &&


<>


<p className="section-label">

❓ Quizzes

</p>





{


normalizeArray(module.quizzes).map((q,i)=>(



<button


key={q._id}


className={

active(q)

?

"lesson-btn active"

:

"lesson-btn"

}


onClick={()=>setSelected({

type:"quiz",

data:q

})}


>


❓ {i+1}. {


q.title ||

q.name ||

"Quiz"

}



</button>




))


}



</>


}











</div>


}









</div>




))



:



<p className="empty-sidebar">

No modules found

</p>


}






</div>













{/* ================= EXIT ================= */}



<button


className="leave-player-btn"


onClick={()=>window.history.back()}

>

← Leave Player

</button>








</div>


);



};




export default Sidebar;