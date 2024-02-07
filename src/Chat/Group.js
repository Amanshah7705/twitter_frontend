import React from 'react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Input, Button, VStack, HStack } from "@chakra-ui/react";
import Navbar from '../Home/Home';
export default function Group() {
  const [count, setCount] = useState(0);
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [allOtherDetails, setAllOtherDetails] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [startData, setStartData] = useState([]);
  const [firstUser, setFirstUser] = useState(null);
  const [secondUser, setSecondUser] = useState(null);
  const [message, setMessage] = useState('');
  const [allId, setAllId] = useState();
  const [forCreateNewGroup, setForCreateNewGroup] = useState('');
  const [buttonChecker, setButtonChecker] = useState(false);

  async function forMyId() {
    try {
      const data = await axios.post(
        `${api}/users/forid`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFirstUser(data.data.data.userId);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  }

  async function forAllId() {
    const data = await axios.post(
      `${api}/users/allid`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    setAllId(data.data.data);
  }

  async function goToUser(id) {
    setSecondUser(id);
    const newData = {
      firstUser: firstUser,
      groupname: id,
    };
    socket.emit("group-from-client", newData);
    setMessage("");
    setCount(count + 1);
  }

  useEffect(() => {
    if (socket !== null && firstUser && secondUser !== null) {
      socket.on('group-data', async (newData) => {
        setAllOtherDetails(newData);
      });
    }
    if (socket !== null) {
      socket.emit('first', {});
      socket.on('second-time', (data) => {
        setSearchResults(data);
        setStartData(data);
      });
    }
    // eslint-disable-next-line
  }, [socket, count]);

  useEffect(() => {
    const s = io(`${api}`);
    setSocket(s);
    forMyId();
    forAllId();
    // eslint-disable-next-line
  }, []);

  async function handleCreateGroup() {
    setButtonChecker(prev => !prev);
    const newData = {
      user: firstUser,
      groupname: forCreateNewGroup
    };
    socket.emit('create-new-group', newData);
    setForCreateNewGroup('');
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchResults(
      startData.filter((user) => user.groupname.startsWith(inputValue))
    );
  }

  async function sendMessage(e) {
    e.preventDefault();
    const newData = {
      user: firstUser,
      groupname: secondUser,
      textabout: message,
    };
    socket.emit("send-data-server-group", newData);
    setMessage('');
  }

  return (
    <div>
       <Navbar/>
    <div className="container mx-auto px-4">
     
      <div className="flex justify-between mb-4">
        <Button onClick={() => navigate('/')} colorScheme="teal">
          Back
        </Button>
        <Button onClick={() => navigate('/chatbox')} colorScheme="teal">
          Go to chat users
        </Button>
      </div>
      <div className="mb-4">
        <Button onClick={() => setButtonChecker(prev => !prev)} colorScheme="teal">Create New Group</Button>
        {buttonChecker && 
          <div>
            <input type='text' onChange={(e) => setForCreateNewGroup(e.target.value)} className="border border-gray-300 rounded px-2 py-1 mr-2" />
            <Button onClick={handleCreateGroup} colorScheme="teal">Submit</Button>
          </div>
        }
        <Input
          placeholder="Search groups..."
          onChange={handleInputChange}
          maxWidth="300px"
          className="mt-4"
        />
        <VStack spacing={4} align="flex-start" w="100%">
          {searchResults.map((user) => (
            <HStack
              key={user._id}
              bg="white"
              p={4}
              rounded="md"
              shadow="md"
              w="100%"
            >
              <Button
                onClick={() => goToUser(user.groupname)}
                colorScheme="teal"
                variant="link"
              >
                Groupname: {user.groupname}
              </Button>
            </HStack>
          ))}
        </VStack>
        {secondUser !== null && (
          <VStack align="flex-start" w="100%" mt={4}>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              w="70%"
              className="border border-gray-300 rounded px-2 py-1 mr-2"
            />
            <Button type="submit" colorScheme="teal" onClick={sendMessage}>
              Send Message
            </Button>
          </VStack>
        )}
      </div>
      <div>
        {allOtherDetails && secondUser !== null && 
          <div>
            {allOtherDetails.map((users, index) => (
              <div key={index}>
                {users.AllChat.map((text, idx) => (
                  <div key={idx}>
                    <div>{allId[text.textfrom]}</div>
                    <div>{text.textabout}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
    </div>
  );
}