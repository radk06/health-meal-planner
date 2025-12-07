import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function OtpVerify({ setToken }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("pendingEmail");
    if (stored) setEmail(stored);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("Email and OTP are required");
      return;
    }

    try {
      const res = await axiosClient.post("/auth/verify-otp", { email, otp });

      const token = res.data?.token;
      if (!token) {
        setError("No token returned from server");
        return;
      }

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.removeItem("pendingEmail");

      setSuccess("Login successful");
      setTimeout(() => {
        navigate("/meals");
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";
      setError(msg);
    }
  };

  return (
    <section>
      <h1>Verify OTP</h1>
      <p>We have sent a 6 digit code to your email.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            readOnly
          />
        </div>
        <div>
          <label>OTP code</label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="123456"
          />
        </div>
        <button type="submit">Verify and login</button>
      </form>
    </section>
  );
}

export default OtpVerify;
