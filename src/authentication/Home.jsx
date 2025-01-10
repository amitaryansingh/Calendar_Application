// import React, { useState } from "react";
// import { signIn, signUp, getUserRoleByEmail, getUserIdByEmail } from "./aapi.jsx";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// const Home = ({ setIsAuthenticated, setRole }) => {
//   const [formType, setFormType] = useState("signin");
//   const [formData, setFormData] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     password: "",
//   });
//   const [signupMessage, setSignupMessage] = useState("");
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (formType === "signin") {
//         const response = await signIn(formData);
//         const { token } = response.data;
//         localStorage.setItem("token", token);
//         localStorage.setItem("email", formData.email);
//         const userIdResponse = await getUserIdByEmail(formData.email);
//         localStorage.setItem("user_id", userIdResponse.data);
//         setIsAuthenticated(true);
//         const roleResponse = await getUserRoleByEmail(formData.email);
//         const role = roleResponse.data.trim();
//         localStorage.setItem("role", role);
//         setRole(role);
//         if (role === "ADMIN") {
//           navigate("/admindashboard");
//         } else if (role === "USER") {
//           navigate("/dashboard");
//         } else {
//           navigate("/");
//         }
//       } else if (formType === "signup") {
//         await signUp(formData);
//         setSignupMessage("Account created! You can now log in.");
//         setFormType("signin");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Authentication failed! Please check your credentials.");
//     }
//   };

//   return (
//     <div className="home-container">
//       <header className="home-header">
//         <h1>Welcome to Calendar App</h1>
//       </header>
//       <div className="auth-container">
//         <h2>{formType === "signin" ? "Sign In" : "Sign Up"}</h2>
//         <form onSubmit={handleSubmit}>
//           {formType === "signup" && (
//             <>
//               <input
//                 type="text"
//                 name="firstname"
//                 placeholder="First Name"
//                 value={formData.firstname}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastname"
//                 placeholder="Last Name"
//                 value={formData.lastname}
//                 onChange={handleInputChange}
//                 required
//               />
//             </>
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />
//           <button type="submit">{formType === "signin" ? "Sign In" : "Sign Up"}</button>
//         </form>
//         {signupMessage && <p style={{ color: "green" }}>{signupMessage}</p>}
//         <p>
//           {formType === "signin" ? (
//             <>
//               Don't have an account?{" "}
//               <span className="toggle-form" onClick={() => setFormType("signup")}>
//                 Sign Up
//               </span>
//             </>
//           ) : (
//             <>
//               Already have an account?{" "}
//               <span className="toggle-form" onClick={() => setFormType("signin")}>
//                 Sign In
//               </span>
//             </>
//           )}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Home;








import React, { useState } from "react";
import { signIn, signUp, getUserRoleByEmail, getUserIdByEmail } from "./aapi.jsx";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ setIsAuthenticated, setRole }) => {
  const [formType, setFormType] = useState("signin");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [signupMessage, setSignupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowMessage, setSlowMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowMessage("");

    const timeout = setTimeout(() => {
      setSlowMessage("Server is slow, please wait 30 seconds...");
    }, 5000); // Show message after 5 seconds

    try {
      if (formType === "signin") {
        const response = await signIn(formData);
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("email", formData.email);
        const userIdResponse = await getUserIdByEmail(formData.email);
        localStorage.setItem("user_id", userIdResponse.data);
        setIsAuthenticated(true);
        const roleResponse = await getUserRoleByEmail(formData.email);
        const role = roleResponse.data.trim();
        localStorage.setItem("role", role);
        setRole(role);
        if (role === "ADMIN") {
          navigate("/admindashboard");
        } else if (role === "USER") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else if (formType === "signup") {
        await signUp(formData);
        setSignupMessage("Account created! You can now log in.");
        setFormType("signin");
      }
    } catch (err) {
      console.error(err);
      alert("Authentication failed! Please check your credentials.");
    } finally {
      clearTimeout(timeout); // Clear the timeout if the request finishes
      setLoading(false);
      setSlowMessage(""); // Reset slow message
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
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : formType === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        {loading && <p>{slowMessage || "Authenticating, please wait..."}</p>}
        {signupMessage && <p style={{ color: "green" }}>{signupMessage}</p>}
        <p>
          {formType === "signin" ? (
            <>
              Don't have an account?{" "}
              <span className="toggle-form" onClick={() => setFormType("signup")}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span className="toggle-form" onClick={() => setFormType("signin")}>
                Sign In
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Home;
