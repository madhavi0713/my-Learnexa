import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./CreateAccount.css";

const CreateAccount = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("Account Created Successfully");
      window.location.href = "/user-login";
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="create-account-container">

      <form
        className="create-account-form"
        onSubmit={handleSubmit}
      >

        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Enter Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Create Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

      </form>

    </div>
  );
};

export default CreateAccount;