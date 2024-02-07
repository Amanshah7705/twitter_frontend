import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../Home/Home";
import { Button, Input, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react"; // Import Chakra UI components
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

export default function Profile() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [Bio, setBio] = useState("");
  const [Location, setLocation] = useState("");
  const [CoverImage, setCoverImage] = useState(null); // Changed to null
  const [BioError, setBioError] = useState("");
  const [LocationError, setLocationError] = useState("");
  const [CoverImageError, setCoverImageError] = useState("");
  const [ans, setAns] = useState(false);

  async function validator() {
    if (!Bio || !Location || !CoverImage) {
      if (!Bio) {
        setBioError("Error Occur at Bio Part");
      }
      if (!Location) {
        setLocationError("Error Occur at Location Part");
      }
      if (!CoverImage) {
        setCoverImageError("Error Occur at Cover Image Part");
      }
      setAns(true);
    } else {
      setAns(false);
      const data = new FormData(); // Use FormData for file uploads
      data.append("profile_picture", CoverImage);
      data.append("bio", Bio);
      data.append("location", Location);
      try {
        // eslint-disable-next-line
        const res = await axios.post(`${api}/users/update-profile`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        });
        navigate("/");
      } catch (error) {
        console.error("Error updating profile:", error);
        navigate("/");
        // Handle error as needed
      }
    }
  }

  return (
    <div>
      <div>
      <Navbar />
      </div>
      <div>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
    
    <div className="text-2xl font-bold mb-4">PROFILE UPDATE PAGE</div>
    <FormControl className="mb-4" isInvalid={ans && BioError}>
      <FormLabel>Bio</FormLabel>
      <Input
        placeholder="Enter Your Bio"
        onChange={(e) => setBio(e.target.value)}
      />
      <FormErrorMessage>{ans && BioError}</FormErrorMessage>
    </FormControl>
    <FormControl className="mb-4" isInvalid={ans && LocationError}>
      <FormLabel>Location</FormLabel>
      <Input
        placeholder="Enter Your Location"
        onChange={(e) => setLocation(e.target.value)}
      />
      <FormErrorMessage>{ans && LocationError}</FormErrorMessage>
    </FormControl>
    <FormControl className="mb-4" isInvalid={ans && CoverImageError}>
      <FormLabel>Cover Image</FormLabel>
      <Input
        type="file"
        onChange={(e) => setCoverImage(e.target.files[0])}
      />
      <FormErrorMessage>{ans && CoverImageError}</FormErrorMessage>
    </FormControl>
    <Button
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      onClick={validator}
    >
      Submit PROFILE
    </Button>
  </div>
      </div>
    </div>

  );
}
