import React,{useState} from "react";
import { normalizeArray, safeRender } from "../../utils/normalizeArray";
import "./ContentViewer.css";



const ContentViewer=({

selected,

markComplete

})=>{



const [answers,setAnswers]=useState({});









// ================= EMPTY =================


if(!selected){


return(

<div className="viewer-card center">


<h1>

Welcome 🚀

</h1>


<p>

Select any module from syllabus roadmap

</p>


</div>

);


}











// ================= YOUTUBE CONVERTER =================


const youtubeURL=(url)=>{


if(!url)

return "";



if(url.includes("watch?v=")){


return url.replace(

"watch?v=",

"embed/"

);


}



if(url.includes("youtu.be")){


return url.replace(

"youtu.be/",

"youtube.com/embed/"

);


}



return url;


};













// ================= MODULE VIEW =================


if(selected.type==="module"){



let module=selected.data;




return(

<div className="viewer-card">



<span className="viewer-tag">

MODULE

</span>




<h1>


{

module.title ||

module.name

}


</h1>





<p>

{

module.description ||

"Complete videos, assignments and quizzes."

}

</p>








<div className="module-start-box">


<h2>

Start this module 🚀

</h2>



<p>

Choose lessons from left sidebar

</p>



</div>






<button

className="complete-btn"

onClick={()=>markComplete(module._id)}

>

✓ Mark Completed

</button>






</div>


);


}
















// ================= VIDEO VIEW =================


if(selected.type==="video"){



let video=selected.data;



return(

<div className="viewer-card">



<span className="viewer-tag">

VIDEO LESSON

</span>





<h1>

{

video.title ||

video.name ||

"Video"

}

</h1>








<div className="video-player">


<iframe


src={youtubeURL(

video.videoUrl ||

video.url ||

video.link

)}


title="course-video"


allowFullScreen

/>



</div>







<p>

{

video.description ||

"Watch complete video lesson"

}

</p>








<button


className="complete-btn"


onClick={()=>markComplete(video._id)}

>

✓ Mark Completed


</button>





</div>


);


}

















// ================= ASSIGNMENT VIEW =================


if(selected.type==="assignment"){



let a=selected.data;



return(

<div className="viewer-card">



<span className="viewer-tag">

ASSIGNMENT

</span>





<h1>

{

a.title ||

a.name ||

"Assignment"

}

</h1>






<div className="assignment-box">


<p>

{

a.description ||

a.question ||

"Complete this assignment"

}

</p>


</div>








{

a.fileUrl &&


<a


className="resource-btn"


href={a.fileUrl}


target="_blank"


rel="noreferrer"

>

Open Resource


</a>

}








<textarea


className="answer-area"


placeholder="Write your solution here..."


value={answers[a._id] || ""}


onChange={(e)=>setAnswers({

...answers,

[a._id]:e.target.value

})}


/>










<button


className="complete-btn"


onClick={()=>markComplete(a._id)}

>

Submit Assignment


</button>







</div>


);


}















// ================= QUIZ VIEW =================



if(selected.type==="quiz"){



let quiz=selected.data;



return(

<div className="viewer-card">





<span className="viewer-tag">

QUIZ

</span>





<h1>

{

quiz.title ||

quiz.name ||

"Quiz"

}

</h1>









{

quiz.questions?.length>0 ?


normalizeArray(quiz.questions).map((q,index)=>(




<div

className="quiz-card"

key={index}

>



<h3>

{index+1}. {q.question}

</h3>






{

normalizeArray(q.options).map((option,i)=>(



<label

className="quiz-option"

key={i}

>


<input


type="radio"


name={`quiz-${index}`}


onChange={()=>setAnswers({

...answers,


[index]:option


})}


/>



{option}



</label>




))

}




</div>





))


:


<p>

No questions available

</p>


}









<button


className="complete-btn"


onClick={()=>markComplete(quiz._id)}

>

Submit Quiz


</button>








</div>


);



}









return null;



};




export default ContentViewer;