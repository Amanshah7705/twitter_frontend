import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Input, Button, VStack, HStack, Image } from "@chakra-ui/react";
import Navbar from "../Home/Home";
import Peer from 'peerjs'
import { useRef } from "react";
export default function VideoCall() {
    const [id,setid]=useState()
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [StartData, SetStartData] = useState([]);
  const  myvideo = useRef(null)
  const myid = useRef(null)
  // eslint-disable-next-line
  const friendid = useRef(null)
  const peerref = useRef(null)
  // eslint-disable-next-line
  const [AllData,SetAllData] = useState()
  const [cc,setcc]=useState(0)
  async function SendToBackend (){
    // console.log(myid.current)
       const newData ={
        myid :id ,mypeerid:myid.current
       }
    //    console.log(newData)
    // eslint-disable-next-line
          const data = await axios.post(`${api}/peer/add`,newData)
  }
  async function ForFetchUser(){
    const responce = await axios.post(`${api}/users/forid`,{},{
     headers: {
       Authorization: `Bearer ${accessToken}`,
       'Content-Type': 'application/json',
     },
    })
    setid(responce.data.data.userId)
 }
 async function videopart() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (myvideo.current) {
        myvideo.current.srcObject = stream;
      }
      peerref.current = new Peer();
      peerref.current.on('open', (id) => {
        myid.current = id;
        setcc(cc+1)
      });
      peerref.current.on('call', (call) => {
        call.answer(stream);
        handleCall(call);
      });
    } catch (error) {
      console.error('Error accessing user media:', error);
    }
  }
  

  useEffect(() => {
    fetchSearchResults();
    ForFetchUser()
    videopart()
    // eslint-disable-next-line
  }, []);
  useEffect(()=>{
    if(id !== null && myid !== null){
            if(myid.current){
                SendToBackend()
            }
            // console.log(id,myid)
        
    }
    // eslint-disable-next-line
  },[id,cc])
  const handleCall = (call)=>{
    call.on('stream',(remotestream)=>{
        const remotevideo = document.createElement('video')
        remotevideo.srcObject = remotestream
        document.body.appendChild(remotevideo)
    })
  }
  async function fetchSearchResults() {
    try {
      const response = await axios.post(
        `${api}/users/searchbar`,
        {
          // Send any required data for initial fetching
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      SetStartData(response.data.data);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      // Handle error as needed
    }
  }

  function handleBack() {
    navigate("/");
  }
 async function goToUser(idx) {
      const newData={
        friendid:idx
      }
      // eslint-disable-next-line
      const data = await axios.post(`${api}/peer/get`,newData)
      console.log(data)
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
    <VStack spacing={4}>
      <HStack>
        <Button onClick={handleBack}>Back</Button>
        <Input placeholder="Search users to call" onChange={handleInputChange} />
      </HStack>
      <VStack spacing={4}>
        {searchResults.map((user) => (
          <HStack key={user._id}>
            <Image
              src={user.userextraField[0]?.profile_picture}
              alt="not found"
              boxSize="50px"
            />
            <Button onClick={() => goToUser(user._id)}>
              Username: {user.username}
            </Button>
          </HStack>
        ))}
      </VStack>
    </VStack>
    </div>

  );
}
