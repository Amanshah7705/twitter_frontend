import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Input, Button, VStack, HStack, Image } from '@chakra-ui/react';

export default function SearchBar() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [StartData,SetStartData] = useState([])
  useEffect(() => {
    fetchSearchResults();
    // eslint-disable-next-line
  }, []); 

  async function fetchSearchResults() {
    try {
      const response = await axios.post(`${api}/users/searchbar`, {
        // Send any required data for initial fetching
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      SetStartData(response.data.data)
      setSearchResults(response.data.data)
    } catch (error) {
      console.error('Error fetching search results:', error);
      // Handle error as needed
    }
  }

  function handleBack() {
    navigate('/');
  }

  function goToUser(id) {
    navigate(`/profile/${id}`);
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchResults(
      StartData.filter(user => user.username.startsWith(inputValue))
    );
  }

  return (
    <VStack spacing={4}>
      <HStack>
        <Button onClick={handleBack}>Back</Button>
        <Input
          placeholder="Search users..."
          onChange={handleInputChange}
        />
      </HStack>
      <VStack spacing={4}>
        {searchResults.map((user) => (
          <HStack key={user._id}>
            <Image src={user.userextraField[0]?.profile_picture} alt="not found" boxSize="50px" />
            <Button onClick={() => goToUser(user._id)}>Username: {user.username}</Button>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
