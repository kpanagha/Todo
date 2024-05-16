import React, { useState, useRef } from 'react';
import './Otp.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("id");
  const [state, setState] = useState({
    text1: "",
    text2: "",
    text3: "",
    text4: "",
  });
  const inputs = useRef([]); // Initialize inputs ref
  const [error, setError] = useState('');
  console.log(state);
  console.log(userId);

  const handleChange = (index, value) => {
    setState({ ...state, [`text${index}`]: value });

    // Move focus to the next input field
    if (index < 4 && value.length === 1) {
      inputs.current[index].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const { text1, text2, text3, text4 } = state;
      console.log(  { text1, text2, text3, text4 } );
      const otp = `${text1}${text2}${text3}${text4}`;
      
      const response = await axios.post("http://localhost:1000/api/v1/verifyOTP", {otp, userId });
      console.log(response,"responceeeeeeeeeeeeeeeeeeeeeeeeeee");
      if (response.data.message === "User Email Verified Successfully") {
        alert("OTP verified successfully!");
        navigate("/login");
      } else {
        setError('Error verifying OTP');
      }
    } catch (error) {
      setError('Error verifying OTP');
      console.error('Error verifying OTP:', error);
    }
  };
 // console.log(handleSubmit());

  return (
    <div className="otp-component container otp-container">
      <header>OTP</header>
      <h4>Please enter the OTP sent to your email</h4>
      <form className="otp-form" onSubmit={handleSubmit} >
        <div className="input-field otp-input-container">
          {[1, 2, 3, 4].map((index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength="1"
              className="otp-input"
              value={state[`text${index}`]}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button  className="login-btn" type="submit" >Verify</button>
      </form>
    </div>
  );
};

export default Otp;
