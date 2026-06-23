import React,{useState} from "react";

import {
Link,
useLocation,
useNavigate
} from "react-router-dom";


import {
FaUserCircle,
FaBars,
FaTimes
} from "react-icons/fa";


import "./Navbar.css";





function Navbar(){


const location = useLocation();

const navigate = useNavigate();


const [menuOpen,setMenuOpen] = useState(false);



const loggedInUser =
JSON.parse(
localStorage.getItem("loggedInUser")
);






const isAuthPage =

location.pathname==="/user-login"

||

location.pathname==="/admin-login"

||

location.pathname==="/create-account";








// LOGOUT

const handleLogout=()=>{


localStorage.removeItem("loggedInUser");

localStorage.removeItem("token");

localStorage.removeItem("userToken");



setMenuOpen(false);



navigate("/user-login");


};










return(



<nav

className={`navbar-container ${
isAuthPage ? "auth-canvas-nav" : ""
}`}

>








{/* LOGO */}


<Link

to="/"

className="navbar-brand-wrapper"

onClick={()=>setMenuOpen(false)}

>



<div className="brand-logo-indicator">

L

</div>




<span className="brand-logo-text">

learnexa

</span>



</Link>









{/* MOBILE BUTTON */}



<button

className="navbar-mobile-toggle-btn"

onClick={()=>setMenuOpen(!menuOpen)}

>


{

menuOpen ?

<FaTimes/>

:

<FaBars/>

}


</button>











{/* CENTER LINKS */}



<ul

className={`navbar-links-deck ${
menuOpen ? "mobile-menu-active" : ""
}`}

>








<li>


<Link

to="/"

className={`nav-deck-link-item ${
location.pathname==="/" ?
"active-tab-node":""
}`}

onClick={()=>setMenuOpen(false)}

>

Home

</Link>


</li>











<li>


<Link

to="/events"

className={`nav-deck-link-item ${
location.pathname==="/events" ?
"active-tab-node":""
}`}

onClick={()=>setMenuOpen(false)}

>

Events

</Link>


</li>









<li>



<Link

to="/courses"

className={`nav-deck-link-item ${
location.pathname==="/courses" ?
"active-tab-node":""
}`}

onClick={()=>setMenuOpen(false)}

>


Courses


</Link>



</li>









{/* MOBILE LOGIN */}


{


!loggedInUser &&


<li className="mobile-auth-only-link-row">


<Link

to="/user-login"

className="nav-deck-link-item"

onClick={()=>setMenuOpen(false)}

>

Login

</Link>



</li>


}





</ul>











{/* RIGHT SIDE */}


<div className="navbar-right-utility-hub">





{


loggedInUser ?



<div className="navbar-profile-action-group">






{/* IMPORTANT FIX PROFILE ALWAYS DASHBOARD */}



<button

className="navbar-avatar-trigger-link"

title="Open Profile"

onClick={()=>{


setMenuOpen(false);


navigate("/user-dashboard");


}}

>



<FaUserCircle

className="avatar-vector-icon"

/>



<span className="avatar-label-txt-fallback">

Profile

</span>




</button>










<button

className="navbar-action-cta-logout-btn"

onClick={handleLogout}

>


Logout


</button>







</div>







:






<div className="navbar-auth-buttons-rack">






<Link

to="/create-account"

className="navbar-cta-btn-link text-btn"

>


Sign Up


</Link>








<Link

to="/user-login"

className="navbar-cta-btn-link filled-primary-btn"

>


Login


</Link>







</div>


}




</div>






</nav>



);


}




export default Navbar;