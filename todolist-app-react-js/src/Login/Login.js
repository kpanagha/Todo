
import React, { useState,useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Mixpanel from 'mixpanel-browser'; // Import Mixpanel
import mixpanel from "mixpanel-browser";

const mixPanelToken ="5ab560bcf67fd7ea0967d3fe88ce79d8" ;

mixpanel.init(mixPanelToken, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
});

const Login = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if the user is already logged in
    const userId = sessionStorage.getItem("id");
    console.log(userId);
    if (userId) {
      navigate("/todo");
    }
  }, [navigate]);

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.email.trim() || !inputs.password.trim()) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1000/api/v1/signin", inputs);

      if (response.data && response.status === 200) {
        const userId = response.data.others._id;

        // Identify the user with Mixpanel
        mixpanel.identify(userId);

        // Set user data in session storage
        sessionStorage.setItem("id", userId);
        const username = response.data.others.username;
        const usermail = response.data.others.email;

        // Set user data in local storage
        localStorage.setItem("username", username);
        localStorage.setItem("usermail", usermail);

        // Track login event
        Loggined(usermail);

        // Navigate to todo page
        //navigate("/todo");
      } else {
        console.error("Unexpected response format:", response);
        alert("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message === "User not found.") {
        console.error("User not found.");
        alert("User not found. Please check your credentials.");
      }
      else if (error.response && error.response.data.message === "User is not verified.") {
        console.error("User is not verified.");
        alert("Please verify your email before signing in.");
      }
      else {
        console.error("Error occurred during login:", error);
        alert("An error occurred during login. Please try again later.");
      }
    }
  };

  const Loggined = (usermail) => {
    mixpanel.track("User Logged In", {
      user_id: usermail,
      login_method: "Email",
      success: true,
      timestamp: new Date().toISOString(),
    });
    mixpanel.people.increment("Logins", 1);
    console.log("Login event tracked successfully");
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="login-heading">Login</h2>
        <div className="form-control">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={inputs.email}
            onChange={change}
          />
          <div className="icon">
            <MdOutlineAlternateEmail />
          </div>
        </div>
        <div className="form-control">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={inputs.password}
            onChange={change}
          />
          <div className="icon">
            <RiLockPasswordFill />
          </div>
        </div>
        <button className="login-btn" type="submit">
          Login
        </button>
        <p className="login-p">
          Don't have an account?
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};


export default Login;
