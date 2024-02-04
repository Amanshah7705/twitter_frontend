import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectFollowlist } from "../redux/listSlice.js";
import axios from "axios";
import Cookies from "js-cookie";
import "./Follow.css";

export default function Follow() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [DataForDisplay, SetDataForDisplay] = useState([]);
  const list_for_display = useSelector(selectFollowlist);

  async function ForFetchDetails() {
    try {
      const response = await axios.post(
        `${api}/users/listfor`,
        {
          list_of_user: list_for_display,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      SetDataForDisplay(response.data.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  async function handler(Id) {
    navigate(`/Profile/${Id}`);
  }

  useEffect(() => {
    ForFetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function backer() {
    navigate("/");
  }
  return (
    <div className="follow-container mx-auto my-8">
      <div>
        <button onClick={backer}>Back</button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Followed Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DataForDisplay?.map((user) => (
          <div key={user.userId} className="mb-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <button
                onClick={() => handler(user.userId)}
                className="text-blue-500 font-bold hover:underline"
              >
                Username: {user.username}
              </button>
              {/* <p className="text-gray-500 mt-2">UserID: {user.userId}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
