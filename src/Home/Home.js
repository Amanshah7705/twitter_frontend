import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';
import './Home.css'
export default function Home() {
  const navigate=useNavigate()
  const [id,setid]=useState()
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get('accessToken');
  async function ForFetchUser(){
     const responce = await axios.post(`${api}/users/forid`,{},{
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
     })
     setid(responce.data.data.userId)
  }
  useEffect(()=>{
     ForFetchUser()
      // eslint-disable-next-line
  },[])
  function addpost(){
      navigate('/tweet/add')
  }
  function showYourpost(){
    navigate('/tweet/show')
  }
  function showAllpost(){
    navigate('/tweet')
  }
  function showYourProfile(){
    navigate(`Profile/${id}`)
  }
  function searchuser(){
    navigate('/searchbar')
  }
  function chatuser(){
    navigate('/chatbox')
  }
  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
    <div className="mb-4">
      <button className="button button-primary" onClick={addpost}>
        Add Post
      </button>
    </div>
    <div className="mb-4">
      <button className="button button-secondary" onClick={showYourpost}>
        Show Your Post
      </button>
    </div>
    <div className="mb-4">
      <button className="button button-success" onClick={showAllpost}>
        Show All Posts
      </button>
    </div>
    <div className="mb-4">
      <button className="button button-warning" onClick={showYourProfile}>
        Show Your Profile
      </button>
    </div>
    <div className="mb-4">
    <button className="button button-info" onClick={searchuser}>
      Search User
    </button>

    </div>
    <button className="button button-info" onClick={chatuser}>
      Chat
    </button>
  </div>
  )
}
