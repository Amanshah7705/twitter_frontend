import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { SelectFollowingList } from '../redux/listSlice';
import './Following.css'
export default function Following() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get('accessToken');
  const navigate = useNavigate();

  const [DataForDisplay, SetDataForDisplay] = useState();
  const list_for_display = useSelector(SelectFollowingList);

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
            'Content-Type': 'application/json',
          },
        }
      );
      SetDataForDisplay(response.data.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  }

  async function handler(Id) {
    navigate(`/Profile/${Id}`);
  }

  useEffect(() => {
    ForFetchDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mx-auto my-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DataForDisplay?.map((user) => (
            <li key={user.userId} className="mb-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <button
                  onClick={() => handler(user.userId)}
                  className="text-blue-500 font-bold"
                >
                  Username: {user.username}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
