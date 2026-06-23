import React, { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

const AdminLogin = () => {

const [formData, setFormData] =
useState({
email: "",
password: "",
});

const handleChange = (e) => {

setFormData({
  ...formData,
  [e.target.name]: e.target.value,
});

};

const handleLogin = async (e) => {

e.preventDefault();

try {

  const response =
    await axios.post(

      "https://brillon-tasks-1.onrender.com/api/v1/admin/login",

      {
        email: formData.email,
        password: formData.password,
      }

    );

  console.log(response.data);

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
    "adminToken",
    response.data.token
  );

  localStorage.setItem(
    "adminLoggedIn",
    "true"
  );

  localStorage.setItem(
    "adminRole",
    response.data.role
  );

  alert(
    "Admin Login Success"
  );

  window.location.href =
    "/admin-dashboard";

} catch (error) {

  console.log(error);

  alert(

    error.response?.data?.error ||

    error.response?.data?.message ||

    "Login Failed"

  );

}

};

return (

<div className="admin-login-container">

  <form
    className="admin-login-form"
    onSubmit={handleLogin}
  >

    <h1>Admin Login</h1>

    <input
      type="email"
      placeholder="Enter Admin Email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
    />

    <input
      type="password"
      placeholder="Enter Password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <button type="submit">
      Login
    </button>

  </form>

</div>

);

};

export default AdminLogin;