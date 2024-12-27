import React, { useState } from "react";
import "./Home.css";
import { signIn, signUp } from "./api.jsx";

const Home = ({ setIsAuthenticated }) => {
  const [formType, setFormType] = useState("signin");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =
        formType === "signin"
          ? await signIn(formData)
          : await signUp(formData);

      localStorage.setItem("token", response.data.token); // Save token
      setIsAuthenticated(true); // Set authentication state
      alert("Welcome!");
    } catch (err) {
      console.error(err);
      alert("Authentication failed!");
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Calendar App</h1>
      </header>
      <div className="auth-container">
        <h2>{formType === "signin" ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{formType === "signin" ? "Sign In" : "Sign Up"}</button>
        </form>
        <p>
          {formType === "signin" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setFormType("signup")}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setFormType("signin")}>Sign In</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Home;
