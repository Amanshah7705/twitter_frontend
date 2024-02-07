import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Navbar() {
  const [id, setId] = useState("");
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  
  async function fetchUserId() {
    try {
      const response = await axios.post(
        `${api}/users/forid`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setId(response.data.data.userId);
    } catch (error) {
      navigate('/Login')
      // console.error("Error fetching user ID:", error);
    }
  }

  useEffect(() => {
    fetchUserId();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const navigateTo = (path) => () => {
    navigate(path);
  };

  return (
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
                <NavbarLink onClick={navigateTo("/tweet/add")}>Add Post</NavbarLink>
                <NavbarLink onClick={navigateTo("/tweet/show")}>Show Your Post</NavbarLink>
                <NavbarLink onClick={navigateTo("/tweet")}>Show All Posts</NavbarLink>
                <NavbarLink onClick={navigateTo(`/Profile/${id}`)}>Show Your Profile</NavbarLink>
                <NavbarLink onClick={navigateTo("/searchbar")}>Search User</NavbarLink>
                <NavbarLink onClick={navigateTo("/chatbox")}>Chat</NavbarLink>
                <NavbarLink onClick={navigateTo("/group")}>Group Chat</NavbarLink>
                <NavbarLink onClick={navigateTo("/")}>Home</NavbarLink>
                <NavbarLink onClick={navigateTo("/videocall")}>VideoCall</NavbarLink>
                <NavbarLink onClick={navigateTo("/ProfileUpdate")} >Update Your Profile</NavbarLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const NavbarLink = ({ onClick, children }) => (
  <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={onClick}>
    {children}
  </button>
);

export default Navbar;
