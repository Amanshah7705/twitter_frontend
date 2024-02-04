import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectuserid } from "../redux/useridslice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateTweet() {
  const id = useSelector(selectuserid);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const api = process.env.REACT_APP_BACKEND_URL;
  const [MyTweet, SetMyTweet] = useState("");

  async function ForFetchPercularTweet() {
    const data = await axios.post(
      `${api}/tweet/fromid`,
      { id: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    SetMyTweet(data.data.data.tweetabout);
  }

  useEffect(() => {
    ForFetchPercularTweet();
    // eslint-disable-next-line
  }, []);

  async function major() {
    // eslint-disable-next-line
    const data = await axios.post(
      `${api}/tweet/update`,
      { id_for_update: id, tweetabout: MyTweet },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    navigate("/tweet/show");
  }
  function backer() {
    navigate("/");
  }
  return (
    <div>
      <div>
        <button onClick={backer}>Back</button>
      </div>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={MyTweet}
            onChange={(e) => SetMyTweet(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold">
            Are you sure you want to update this?
          </h4>
        </div>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            type="submit"
            onClick={major}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
