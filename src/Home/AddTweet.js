import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
export default function AddTweet() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get('accessToken');
  const navigate = useNavigate()
  const [TweetAbout, setTweetAbout] = useState('');
  const [TweetAboutError, setTweetAboutError] = useState(null);

  async function validator() {
    if (!TweetAbout) {
      setTweetAboutError('Field should not be empty');
    } else {
      const data = {
        tweetabout: TweetAbout,
      };
      try {
        const response = await axios.post(`${api}/tweet/add`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json', // Use 'application/json' for JSON data
          },
        });
        console.log(response);
        navigate('/')
      } catch (error) {
        console.error('Error posting tweet:', error);
        // Handle error as needed
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <div className="text-2xl font-bold mb-4">Add Tweet</div>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Enter your tweet"
          onChange={(e) => setTweetAbout(e.target.value)}
        ></textarea>
        {TweetAboutError !== null && <p className="text-red-500">{TweetAboutError}</p>}
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          type="submit"
          onClick={validator}
        >
          Post
        </button>
      </div>
    </div>
  );
}
