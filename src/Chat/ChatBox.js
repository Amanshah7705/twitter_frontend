import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button, VStack, HStack, Image, Text } from "@chakra-ui/react";
import { Portal } from "@radix-ui/react-portal";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import Navbar from "../Home/Home";

export default function ChatBox() {
  const [count, setcount] = useState(0);
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [AllOtherDetails, setAllOtherDetails] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [StartData, setStartData] = useState([]);
  const [firstuser, setFirstuser] = useState(null);
  const [seconduser, setSeconduser] = useState(null);
  const [Message, SendMessage] = useState("");
  const [allid, setallid] = useState({});

  async function fetchSearchResults() {
    try {
      const response = await axios.post(
        `${api}/users/searchbar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStartData(response.data.data);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  async function ForMyId() {
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
      setFirstuser(data.data.data.userId);
    } catch (error) {
      navigate('/Login')
    }
  }

  async function ForAllid() {
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
    setallid(data.data.data);
  }

  useEffect(() => {
    const s = io(`${api}`);
    setSocket(s);
    fetchSearchResults();
    ForMyId();
    ForAllid();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (socket !== null) {
      socket.on("send-data-to-client", async (data) => {
        setAllOtherDetails(data);
      });
    }
  }, [count, socket]);

  function handleBack() {
    navigate("/");
  }

  async function send_message(e) {
    e.preventDefault();
    const newData = {
      user1: firstuser,
      user2: seconduser,
      textabout: Message,
    };

    socket.emit("send-data-server", newData);
    setcount(count + 1);
  }

  async function goToUser(id) {
    setSeconduser(id);
    const newData = {
      firstuser: firstuser,
      seconduser: id,
    };
    socket.emit("id-from-client", newData);
    setcount(count + 1);
    SendMessage("");
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchResults(
      StartData.filter((user) => user.username.startsWith(inputValue))
    );
  }

  return (
    <div>
      <Navbar/>
    <VStack spacing={4} align="center" mt={8} w="100%">
      <HStack w="100%" justify="space-between">
        <Button colorScheme="blue" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={() => navigate('/group')} >
          Go To Groups
        </Button>
        <Input
          placeholder="Search users..."
          onChange={handleInputChange}
          maxWidth="300px"
        />
      </HStack>
      <VStack spacing={4} align="flex-start" w="100%">
        {searchResults.map((user) => (
          <HStack
            key={user._id}
            bg="white"
            p={4}
            rounded="md"
            shadow="md"
            w="100%"
            alignItems="center"
          >
            <Image
              src={user.userextraField[0]?.profile_picture}
              alt="not found"
              boxSize="50px"
              rounded="full"
            />
            <Button
              onClick={() => goToUser(user._id)}
              colorScheme="teal"
              variant="link"
            >
              Username: {user.username}
            </Button>
          </HStack>
        ))}
      </VStack>
      {seconduser !== null && (
        <VStack align="flex-start" w="100%" mt={4}>
          <Input
            type="text"
            value={Message}
            onChange={(e) => SendMessage(e.target.value)}
            placeholder="Enter message"
            w="70%"
          />
          <Button type="submit" colorScheme="teal" onClick={send_message}>
            Send Message
          </Button>
        </VStack>
      )}
      {seconduser !== null && AllOtherDetails && (
        <VStack mt={4} spacing={2} align="flex-start" w="100%">
          <Text>{allid[AllOtherDetails[0]?.user1]}</Text>
          <Text>{allid[AllOtherDetails[0]?.user2]}</Text>
        </VStack>
      )}
      <VStack mt={4} align="flex-start" w="100%">
        {AllOtherDetails &&
          AllOtherDetails.map((users) => (
            <VStack key={users._id} spacing={2} align="flex-start" w="100%">
              {users.AllChat &&
                users.AllChat.map((chats, index) => (
                  <div key={index}>
                    <Popover>
                      <PopoverTrigger>
                        <div bg="gray.100" p={2} rounded="md" cursor="pointer">
                          {chats.textabout}
                          {chats.textfrom}
                        </div>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Message Details</PopoverHeader>
                          <PopoverBody>
                            <div>{chats.textabout}</div>
                            <div>{chats.textfrom}</div>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </div>
                ))}
            </VStack>
          ))}
      </VStack>
    </VStack>
    </div>
  );
}