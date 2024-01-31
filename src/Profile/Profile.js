import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Profile() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [Bio, setBio] = useState('');
  const [Location, setLocation] = useState('');
  const [CoverImage, setCoverImage] = useState(null); // Changed to null
  const [BioError, setBioError] = useState('');
  const [LocationError, setLocationError] = useState('');
  const [CoverImageError, setCoverImageError] = useState('');
  const [ans, setAns] = useState(false);

  async function validator() {
    if (!Bio || !Location || !CoverImage) {
      if (!Bio) {
        setBioError('Error Occur at Bio Part');
      }
      if (!Location) {
        setLocationError('Error Occur at Location Part');
      }
      if (!CoverImage) {
        setCoverImageError('Error Occur at Cover Image Part');
      }
      setAns(true);
    } else {
      setAns(false);
      const data = new FormData(); // Use FormData for file uploads
      data.append('profile_picture', CoverImage);
      data.append('bio', Bio);
      data.append('location', Location);
      try {
        // console.log(accessToken);
        const res = await axios.post(`${api}/users/update-profile`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data', // Set content type for FormData
          },
        });
        console.log(res);
        navigate('/');
      } catch (error) {
        console.error('Error updating profile:', error);
        navigate('/')
        // Handle error as needed
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <div className="text-2xl font-bold mb-4">PROFILE UPDATE PAGE</div>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded-md"
          placeholder="Enter Your Bio"
          type="text"
          onChange={(e) => setBio(e.target.value)}
        />
        {ans && <p className="text-red-500">{BioError}</p>}
      </div>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded-md"
          placeholder="Enter Your Location"
          type="text"
          onChange={(e) => setLocation(e.target.value)}
        />
        {ans && <p className="text-red-500">{LocationError}</p>}
      </div>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded-md"
          type="file"
          onChange={(e) => setCoverImage(e.target.files[0])} // Use e.target.files
        />
        {ans && <p className="text-red-500">{CoverImageError}</p>}
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          type="button" // Set type to "button" to prevent form submission
          onClick={validator}
        >
          Submit PROFILE
        </button>
      </div>
    </div>
  );
}
