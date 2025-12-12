import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function OtpVerify({ setToken }) {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("pendingEmail");
    if (!stored) {
      setError("No login in progress, please login again");
    } else {
      setEmail(stored);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("No email found, please login again");
      return;
    }
    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      const res = await axiosClient.post("/auth/verify-otp", {
        email,
        otp,
      });

      const token = res.data?.token;
      if (!token) {
        setError("No token returned");
        return;
      }

      localStorage.removeItem("pendingEmail");
      localStorage.setItem("token", token);
      if (setToken) {
        setToken(token);
      }

      setSuccess("Login successful");
      setTimeout(() => {
        navigate("/meals");
      }, 400);
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";
      setError(msg);
    }
  };

  return (
    <section>
      <h1>Verify OTP</h1>
      {email && <p><small>OTP sent for: {email}</small></p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>One time code</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter the 6 digit code"
          />
        </div>
        <button type="submit">Verify and login</button>
      </form>
    </section>
  );
}

export default OtpVerify;
