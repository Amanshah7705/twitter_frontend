import React from "react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
function Navbar() {
  const [id,setid]=useState()
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get('accessToken');
  async function ForFetchUser(){
     const responce = await axios.post(`${api}/users/forid`,{},{
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
     })
     setid(responce.data.data.userId)
  }
  useEffect(()=>{
     ForFetchUser()
      // eslint-disable-next-line
  },[])
  const navigate = useNavigate();

  function addpost() {
    navigate("/tweet/add");
  }
  function showYourpost() {
    navigate("/tweet/show");
  }
  function showAllpost() {
    navigate("/tweet");
  }
  function showYourProfile() {
     navigate(`/Profile/${id}`);
  }
  function searchuser() {
    navigate("/searchbar");
  }
  function chatuser() {
    navigate("/chatbox");
  }
  function groupuser(){
    navigate('/group')
  }
 function homeuser(){
   navigate('/')
 }
  return (
    <div>
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Insert your logo or brand name here */}
              <span className="text-white">Logo</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={addpost}>
                  Add Post
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={showYourpost}>
                  Show Your Post
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={showAllpost}>
                  Show All Posts
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={showYourProfile}>
                  Show Your Profile
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={searchuser}>
                  Search User
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={chatuser}>
                  Chat
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={groupuser}>
                  Group Chat
                </button>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={homeuser}>
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </div>

  );
}

export default Navbar;
