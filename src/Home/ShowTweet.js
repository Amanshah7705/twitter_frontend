import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setuserid } from '../redux/useridslice.js';

export default function ShowTweet() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const [myTweets, setMyTweets] = useState([]);
  const accessToken = Cookies.get('accessToken');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function ForFetchDetails() {
    try {
      const response = await axios.post(`${api}/tweet/getall`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setMyTweets(response.data.data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  }

  useEffect(() => {
    ForFetchDetails();
    // eslint-disable-next-line
  }, []);  

  async function changeupdate(id) {
    dispatch(setuserid(id));
    navigate('/tweet/update');
  }

  async function changedelete(id) {
    dispatch(setuserid(id));
    navigate('/tweet/delete');
  }

  async function removelikes(id) {
    const data =await axios.post(`${api}/likes/remove`, { whichtweet: id }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
     console.log(data)
     navigate('/tweet/show');
  }

  async function addlikes(id) {
   const data = await axios.post(`${api}/likes/add`, { whichtweet: id }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
     console.log(data)
     navigate('/tweet/show');
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <div className="text-2xl font-bold mb-4">My Tweets</div>
      {myTweets.length ? (
        <ul className="space-y-4">
          {myTweets.map((tweet) => (
            <li key={tweet._id} className="border p-4 rounded-md">
              <div className="text-xl font-semibold mb-2">{tweet.tweetabout}</div>
              {tweet.LikedByme === true && (
                <div className="flex items-center space-x-2">
                  <span>{tweet.totalLikes}</span>
                  <button onClick={() => removelikes(tweet._id)} className="text-red-500">Remove Like</button>
                </div>
              )}
              {tweet.LikedByme === false && (
                <div className="flex items-center space-x-2">
                  <span>{tweet.totalLikes}</span>
                  <button onClick={() => addlikes(tweet._id)} className="text-blue-500">Add Like</button>
                </div>
              )}
              <div className="flex space-x-4 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => changeupdate(tweet._id)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  onClick={() => changedelete(tweet._id)}
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
  );
}
