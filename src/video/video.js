import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Input, Button, Image } from "@chakra-ui/react";
import Navbar from "../Home/Home";
import Peer from 'peerjs';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function VideoCall() {
    const [id, setId] = useState(null);
    const api = process.env.REACT_APP_BACKEND_URL;
    const accessToken = Cookies.get("accessToken");
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [StartData, setStartData] = useState([]);
    const [call, setCall] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [callAnswered, setCallAnswered] = useState(false);
    // eslint-disable-next-line
    const [remoteStream, setRemoteStream] = useState(null);

    const myvideo = useRef(null);
    const remoteVideo = useRef(null);
    const myid = useRef(null);
    const friendid = useRef(null);
    const peerref = useRef(null);
    const [cc, setCC] = useState(0);
    let xp = 0;

    async function SendToBackend() {
        const newData = {
            myid: id,
            mypeerid: myid.current
        };
        try {
            await axios.post(`${api}/peer/add`, newData);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    }

    async function ForFetchUser() {
        try {
            const response = await axios.post(`${api}/users/forid`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            setId(response.data.data.userId);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
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
                setCC(cc + 1);
            });
            peerref.current.on('call', (incomingCall) => {
                setIncomingCall(true);
                handleCall(incomingCall);
            });
        } catch (error) {
            console.error('Error accessing user media:', error);
        }
    }

    useEffect(() => {
        if (xp === 1) {

        } else {
            xp++;

            fetchSearchResults();
            ForFetchUser();
            videopart();
        }
        return () => {
            if (peerref.current) {
                peerref.current.destroy();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (id !== null && myid !== null) {
            if (myid.current) {
                SendToBackend();
            }
        }
        // eslint-disable-next-line
    }, [id, cc]);

    const handleCall = (incomingCall) => {
        incomingCall.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteStream;
            }
        });
        setCall(incomingCall);
    };

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

    function handleBack() {
        navigate("/");
    }

    function handleInputChange(event) {
        const inputValue = event.target.value;
        setSearchResults(
            StartData.filter((user) => user.username.startsWith(inputValue))
        );
    }

    async function callFriend(idx) {
        try {
            const newData = {
                friendid: idx
            };
            const data = await axios.post(`${api}/peer/get`, newData);
            friendid.current = data.data.data[0].PeerId;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const newCall = peerref.current.call(friendid.current, stream);
            handleCall(newCall);
            newCall.on('close', () => {
                setRemoteStream(null);
                setIncomingCall(false);
            });
        } catch (error) {
            console.error('Error calling friend:', error);
        }
    }

    async function answerCall() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (call) {
                setCallAnswered(true); // Set call as answered
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                    if (remoteVideo.current) {
                        remoteVideo.current.srcObject = remoteStream;
                    }
                });
                call.on('close', () => {
                    setRemoteStream(null);
                    setIncomingCall(false);
                });
            }
        } catch (error) {
            console.error('Error answering call:', error);
        }
    }

    // Function to toggle video
    const toggleVideo = () => {
        const videoTrack = myvideo.current.srcObject.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
    };

    // Function to toggle audio
    const toggleAudio = () => {
        const audioTrack = myvideo.current.srcObject.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex justify-between px-4 py-2">
                <Button onClick={handleBack}>Back</Button>
                <Input placeholder="Search users to call" onChange={handleInputChange} />
            </div>
            <div className="flex-grow overflow-y-auto">
                {searchResults.map((user) => (
                    <div key={user._id} className="flex items-center justify-between px-4 py-2 border-b">
                        <div className="flex items-center space-x-4">
                            <Image src={user.userextraField[0]?.profile_picture} alt="not found" boxSize="50px" />
                            <span>{user.username}</span>
                        </div>
                        <Button onClick={() => callFriend(user._id)}>Call</Button>
                    </div>
                ))}
                {incomingCall && !callAnswered && (
                    <div className="flex items-center justify-center p-4">
                        <p>Incoming Call...</p>
                        <Button onClick={answerCall}>Answer</Button>
                    </div>
                )}
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
                    <Box mb={8} textAlign="center">
                        <Heading as="h1" size="lg" mb={2}>Video Call App</Heading>
                        <Text fontSize="md">Enjoy seamless video calling experience</Text>
                    </Box>

                    <Box display="flex" justifyContent="center" p={4}>
                        <Box mr={8} textAlign="center">
                            <Text fontSize="lg" fontWeight="bold" mb={2}>Remote Stream</Text>
                            <video autoPlay ref={remoteVideo} className="rounded-lg shadow-md" style={{ maxWidth: "100%" }} />
                        </Box>

                        <Box textAlign="center">
                            <Text fontSize="lg" fontWeight="bold" mb={2}>Local Stream</Text>
                            <video autoPlay ref={myvideo} className="rounded-lg shadow-md" style={{ maxWidth: "100%" }} />
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button onClick={toggleVideo} mr={4}>Toggle Video</Button>
                        <Button onClick={toggleAudio}>Toggle Audio</Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
}
