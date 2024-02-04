import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewPasswordPage() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = () => {
    try {
      if (emailRegex.test(email)) {
        setEmailError("");
      } else {
        setEmailError("Invalid email");
      }
    } catch (error) {
      setEmailError("Invalid email");
    }
  };

  const validatePassword = () => {
    try {
      if (passwordRegex.test(password)) {
        setPasswordError("");
      } else {
        setPasswordError("Invalid password");
      }
    } catch (error) {
      setPasswordError("Invalid password");
    }
  };

  const validator = async () => {
    try {
      validateEmail();
      validatePassword();

      if (!emailError && !passwordError) {
        const data = {
          email: email,
          password: password,
        };
        // eslint-disable-next-line
        const res = await axios.post(`${api}/users/new-password`, data);
        setEmail("");
        setPassword("");
        navigate("/Login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
        <h2 className="text-2xl font-bold mb-4">Sign Up Page</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>

        <div>
          <button
            type="submit"
            onClick={validator}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
