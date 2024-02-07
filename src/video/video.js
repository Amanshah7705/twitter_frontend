import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Input, Button, Image } from "@chakra-ui/react";
import Navbar from "../Home/Home";
import Peer from 'peerjs'
import { useRef } from "react";

export default function VideoCall() {
    const [id, setId] = useState(null);
    const api = process.env.REACT_APP_BACKEND_URL;
    const accessToken = Cookies.get("accessToken");
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [StartData, setStartData] = useState([]);
    const [call, setCall] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [remoteStream, setRemoteStream] = useState(null);

    const myvideo = useRef(null);
    const myid = useRef(null);
    const friendid = useRef(null);
    const peerref = useRef(null);
    const [cc, setCC] = useState(0);
    async function SendToBackend() {
        console.log(myid.current)
        const newData = {
            myid: id,
            mypeerid: myid.current
        };
        // eslint-disable-next-line
        const data = await axios.post(`${api}/peer/add`, newData);
    }

    async function ForFetchUser() {
        const response = await axios.post(`${api}/users/forid`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        setId(response.data.data.userId);
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
            peerref.current.on('call', (call) => {
                setIncomingCall(true);
                call.answer(stream);
                handleCall(call);
            });
        } catch (error) {
            console.error('Error accessing user media:', error);
        }
    }

    useEffect(() => {
        fetchSearchResults();
        ForFetchUser();
        videopart();
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

    const handleCall = (call) => {
        call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
        });
        setCall(call);
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
            console.log(data)
            friendid.current = data.data.data[0].PeerId;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const call = peerref.current.call(friendid.current, stream);
            setCall(call);

            call.on('stream', (remoteStream) => {
                setRemoteStream(remoteStream);
            });

            call.on('close', () => {
                setRemoteStream(null);
                setIncomingCall(false);
            });
        } catch (error) {
            console.error('Error calling friend:', error);
        }
    }

    async function answerCall() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            call.answer(stream);
             
            call.on('stream', (remoteStream) => {
                setRemoteStream(remoteStream);
            });

            call.on('close', () => {
                setRemoteStream(null);
                setIncomingCall(false);
            });
        } catch (error) {
            console.error('Error answering call:', error);
        }
    }

    return (
        <div className="flex flex-col h-full">
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
                {incomingCall && (
                    <div className="flex items-center justify-center p-4">
                        <p>Incoming Call...</p>
                        <Button onClick={answerCall}>Answer</Button>
                    </div>
                )}
                {remoteStream && (
                    <div className="flex items-center justify-center p-4">
                        <p>Remote Stream</p>
                        <video autoPlay ref={remoteStream} />
                    </div>
                )}
                <div className="flex items-center justify-center p-4">
                    <p>Local Stream</p>
                    <video autoPlay ref={myvideo} />
                </div>
            </div>
        </div>
    );
}
