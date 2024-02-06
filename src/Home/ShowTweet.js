import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserid } from "../redux/useridslice.js";
import Navbar from "./Home.js";

export default function ShowTweet() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const [myTweets, setMyTweets] = useState([]);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [LikedUser, setLikedUser] = useState({});

  // Fetch tweet details
  async function fetchTweetDetails() {
    try {
      const response = await axios.post(
        `${api}/tweet/getallfromthatuser`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const initialLikedUserStatus = response.data.data.reduce((acc, tweet) => {
        acc[tweet._id] = 0;
        return acc;
      }, {});
      setLikedUser(initialLikedUserStatus);
      setMyTweets(response.data.data);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  }

  useEffect(() => {
    fetchTweetDetails();
    // eslint-disable-next-line
  }, []);

  // Handle tweet actions
  async function handleTweetAction(id, actionType) {
    dispatch(setuserid(id));
    navigate(`/tweet/${actionType}`);
  }

  // Remove likes
  async function removeLikes(id) {
    try {
      await axios.post(
        `${api}/likes/remove`,
        { whichtweet: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Reload tweets after removing likes
      // setLikedUser((prev) => ({ ...prev, [id]: 0 }));

      fetchTweetDetails();
    } catch (error) {
      console.error("Error removing likes:", error);
    }
  }

  // Add likes
  async function addLikes(id) {
    try {
      await axios.post(
        `${api}/likes/add`,
        { whichtweet: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // setLikedUser((prev) => ({ ...prev, [id]: 0 }));

      // Reload tweets after adding likes
      fetchTweetDetails();
    } catch (error) {
      console.error("Error adding likes:", error);
    }
  }

  async function changer(id) {
    setLikedUser((prev) => ({ ...prev, [id]: !LikedUser[id] }));
  }
  function backer() {
    navigate("/");
  }
  return (
    <div>
      <Navbar/>
      <div>
        <button onClick={backer}>Back</button>
      </div>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
        <div className="text-2xl font-bold mb-4">My Tweets</div>
        {myTweets.length ? (
          <ul className="space-y-4">
            {myTweets.map((tweet) => (
              <li
                key={tweet._id}
                className="border p-4 rounded-md hover:shadow-md transition duration-300"
              >
                <div className="text-xl font-semibold mb-2">
                  {tweet?.tweetabout}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    {tweet?.totallikes} Likes
                  </span>
                  {tweet?.LikedByme ? (
                    <button
                      onClick={() => removeLikes(tweet._id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove Like
                    </button>
                  ) : (
                    <button
                      onClick={() => addLikes(tweet._id)}
                      className="text-blue-500 hover:underline"
                    >
                      Add Like
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={() => changer(tweet._id)}
                  >
                    {LikedUser[tweet._id]
                      ? "Hide Users"
                      : "Show Users who Liked"}
                  </button>
                </div>
                {LikedUser[tweet._id] ? (
                  <div className="mt-2">
                    <ul>
                      {tweet.likestweetuser.map((user1) => (
                        <li key={user1._id}>
                          <div className="text-gray-700">{user1.username}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => handleTweetAction(tweet._id, "update")}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => handleTweetAction(tweet._id, "delete")}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tweets to display.</p>
        )}
      </div>
    </div>
  );
}
