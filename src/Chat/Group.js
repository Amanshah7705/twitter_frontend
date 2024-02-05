import React from 'react'
import { useState,useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Input, Button, VStack, HStack, Image } from "@chakra-ui/react";
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
export default function Group() {
  const [count, setcount] = useState(0);
  const api = process.env.REACT_APP_BACKEND_URL;
  const api1 = process.env.REACT_APP_SERVER_URL;
  const accessToken = Cookies.get("accessToken");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [AllOtherDetails, setAllOtherDetails] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [StartData, setStartData] = useState([]);
  const [firstuser, setFirstuser] = useState(null);
  const [seconduser, setSeconduser] = useState(null);
  const [Message, SendMessage] = useState();
  const [allid, setallid] = useState();
  const [ForCreateNewGroup,SetForCreateNewGroup] = useState()
  const [ForJoinAGroup,SetForJoinAgroup] = useState()
  const [ButtonChecker,SetButtonChecker] = useState()
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
      console.error("Error fetching user ID:", error);
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
  async function goToUser(id) {
    setSeconduser(id);
    const newData = {
      firstuser: firstuser,
      groupname: id,
    };
    socket.emit("group-from-client", newData);
    socket.on('group-data',async(newData)=>{
         setAllOtherDetails(newData)
    })
    SendMessage("");
  }
  useEffect(()=>{
       if(socket !== null && firstuser  && seconduser){
        socket.on('group-data',async(newData)=>{
            setAllOtherDetails(newData)
       })
       }
  },[socket])
  useEffect(()=>{
    const s = io(`${api1}`);
    setSocket(s);
    ForMyId();
    ForAllid();
    s.emit('first-time',{})
    s.on('second-time',(data)=>{
        console.log(data)
       setSearchResults(data)
       setStartData(data)
        
    })
  },[])
  async function HandleCreateGroup(){
       SetButtonChecker((prev)=>(!prev))
       const newData ={
        user:firstuser,
        groupname:SetForCreateNewGroup
       }

       socket.emit('create-new-group',newData)
       socket.on('second-time',(data)=>{
        setSearchResults(data)
        setStartData(data)
         
       })
  }
  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchResults(
      StartData.filter((user) => user.username.startsWith(inputValue))
    );
  }
  async function send_message(e) {
    e.preventDefault();
    const newData = {
         user:firstuser,
        groupname:seconduser,
      textabout: Message,
    };

    socket.emit("send-data-server-group", newData);
  }

  return (
    <div>
        <div>
       <Button onClick={()=>navigate('/')} >
        Back
       </Button>
       <Button onClick={()=>navigate('/chatbox')}>
        Go to chat users
       </Button>
       </div>
       <div>
        <Button onClick={()=>SetButtonChecker((prev)=>(!prev))} >Create New Group</Button>
        {
            ButtonChecker && <div>
                <input type='text' onChange={(e)=>SetForCreateNewGroup(e.target.value)} ></input>
                <Button onClick={HandleCreateGroup}>
                     Submit
                </Button>
                 </div>
        }
        <Input
          placeholder="Search groups..."
          onChange={handleInputChange}
          maxWidth="300px"
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
       </div>
    </div>
  )
}
