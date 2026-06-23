import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import API from "../../Services/eventApi";

import "./VerifyEmail.css";


const VerifyEmail = () => {

  const { token } = useParams();

  const navigate = useNavigate();


  const calledOnce = useRef(false);


  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);



  useEffect(() => {


    // React StrictMode double API call fix
    if(calledOnce.current) return;

    calledOnce.current = true;


    verifyEmail();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const verifyEmail = async()=>{


    if(!token){

      setSuccess(false);

      setMessage(
        "Verification token missing"
      );

      setLoading(false);

      return;

    }


    try{


      console.log(
        "VERIFY TOKEN:",
        token
      );


      const response =
        await API.get(
          `/user/verify-email/${token}`
        );


      console.log(
        "VERIFY RESPONSE:",
        response.data
      );


      setSuccess(true);


      setMessage(
        "Email Verified Successfully"
      );



      setTimeout(()=>{


        navigate(
          "/user-login",
          {
            replace:true
          }
        );


      },3000);



    }
    catch(error){


      console.log(
        "VERIFY ERROR:",
        error.response?.data
      );


      setSuccess(false);


      setMessage(

        error.response?.data?.error ||

        "Token expired or already verified"

      );


    }
    finally{


      setLoading(false);


    }


  };




return (


<div className="verify-container">


<div className="verify-card">


{

loading ?


<>

<div className="loader"></div>

<h2>
Verifying Email...
</h2>


</>


:


<>


<div
className={
success
?
"success-icon"
:
"failed-icon"
}
>


{
success
?
"✓"
:
"×"
}


</div>



<h2>


{
success
?
"Verification Successful"
:
"Verification Failed"
}


</h2>



<p>

{message}

</p>


{
success &&
<p className="redirect">
Redirecting to login...
</p>
}



<button

onClick={()=>navigate("/user-login")}

>

Return to Login

</button>



</>



}


</div>


</div>


);


};


export default VerifyEmail;