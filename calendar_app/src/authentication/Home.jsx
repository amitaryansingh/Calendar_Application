import React, { useState } from "react";
import { signIn, signUp, getUserRoleByEmail } from "./aapi.jsx"; // Ensure you import getUserRoleByEmail
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ setIsAuthenticated }) => {
  const [formType, setFormType] = useState("signin");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [signupMessage, setSignupMessage] = useState(""); // State to store signup message
  const navigate = useNavigate(); // Create navigate function for redirect

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === "signin") {
        // Sign in logic
        const response = await signIn(formData);
        const { token } = response.data;
        localStorage.setItem("token", token); // Save token
        localStorage.setItem("email", formData.email); // Save email for role checking

        setIsAuthenticated(true); // Set authentication state

        // Fetch user role only after successful login
        const roleResponse = await getUserRoleByEmail(formData.email);
        if (roleResponse.data === "ADMIN") {
          navigate("/admindashboard");
        } else {
          navigate("/dashboard");
        }

        alert("Welcome!");
      } else if (formType === "signup") {
        // Sign up logic with the additional fields
        await signUp(formData);
        setSignupMessage("Account created! You can now log in."); // Show success message
        setFormType("signin"); // Switch form to sign in after successful signup
      }
    } catch (err) {
      console.error(err);
      alert("Authentication failed! Please check your credentials.");
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
          {formType === "signup" && (
            <>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
            </>
          )}
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
        {signupMessage && <p style={{ color: "green" }}>{signupMessage}</p>} {/* Show signup success message */}
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
