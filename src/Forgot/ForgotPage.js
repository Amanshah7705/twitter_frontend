import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const api = process.env.REACT_APP_BACKEND_URL
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    try {
      if (emailRegex.test(email)) {
        setEmailError('');
      } else {
        setEmailError('Invalid email');
      }
    } catch (error) {
      setEmailError('Invalid email');
    }
  };


  const validator = async () => {
    try {
      validateEmail();

      if (!emailError ) {
        const data = {
         
          email: email,
        };
        const res=await axios.post(`${api}/users/forgot-password`, data);
        console.log(res)
      
        setEmail('');
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md md:w-96 w-full">
        <h2 className="text-2xl font-bold mb-4">ForgotPassword  Page</h2>

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
        <div>
          <button
            type="submit"
            onClick={validator}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

