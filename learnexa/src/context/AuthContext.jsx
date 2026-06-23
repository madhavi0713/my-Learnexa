import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser, changePassword as apiChangePassword } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (savedToken && savedToken !== "null" && savedToken !== "undefined" && savedToken.trim() !== "") {
        setToken(savedToken);
        try {
          const response = await getCurrentUser();
          const userData = response.data || response.user || response;
          setUser(userData);
          localStorage.setItem("loggedInUser", JSON.stringify(userData));
        } catch (err) {
          console.error("Session validation failed", err);
          logout();
        }
      } else {
        logout(); // clear out any stale user data if no token
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      
      // Save token and user details
      const userToken = data.token;
      const userData = data.user || data.data || { email };

      setToken(userToken);
      setUser(userData);

      localStorage.setItem("token", userToken);
      localStorage.setItem("userToken", userToken);
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      return { success: true, user: userData, isFirstLogin: data.isFirstLogin || userData.isFirstLogin };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Login failed";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await registerUser(userData);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Registration failed";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("adminToken");
  };

  const updatePassword = async (newPassword) => {
    setError(null);
    setLoading(true);
    try {
      const response = await apiChangePassword(newPassword);
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to update password";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updatePassword, certificates, setCertificates }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
