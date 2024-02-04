import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const userRegex = /^[a-zA-Z0-9_]{4,20}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUser = () => {
    try {
      if (userRegex.test(username)) {
        setUserError("");
      } else {
        setUserError("Invalid username");
      }
    } catch (error) {
      setUserError("Invalid username");
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
      validateUser();
      validatePassword();

      if (!userError && !passwordError) {
        const data = {
          username: username,
          password: password,
        };

        const responce = await axios.post(`${api}/users/login`, data);
        const { accessToken, refreshToken } = responce.data.data;

        document.cookie = `accessToken=${accessToken}; path=/;`;
        document.cookie = `refreshToken=${refreshToken}; path=/;`;

        setUsername("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goToSignup = () => {
    navigate("/Signup");
  };

  const goToForgotPassword = () => {
    navigate("/ForgotPassword");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
        <h2 className="text-2xl font-bold mb-4">Login Page</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {userError && <p className="text-red-500">{userError}</p>}
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
            Login
          </button>

          <button
            onClick={goToSignup}
            className="text-blue-500 cursor-pointer underline mt-2 block"
          >
            Not An Account? Sign Up
          </button>

          <button
            onClick={goToForgotPassword}
            className="text-blue-500 cursor-pointer underline mt-2 block"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
