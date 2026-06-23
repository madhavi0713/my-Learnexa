import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./UserLogin.css";

const UserLogin = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      alert("User Login Success");
      
      if (result.isFirstLogin) {
        alert("This is your first time logging in. Please change your temporary password.");
      }
      window.location.href = "/profile";
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-container">
      <form className="user-login-form" onSubmit={handleLogin}>
        <h1>User Login</h1>

        <input
          type="email"
          placeholder="Enter Email Address"
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

        <button type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;