import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserid } from "../redux/useridslice.js";
import {
  Button,
  Input,
  Textarea,
  List,
  ListItem,
  Box,
  Collapse,
} from "@chakra-ui/react";
import Navbar from "./Home.js";

export default function ShowAllTweet() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const [myTweets, setMyTweets] = useState([]);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [LikedUser, setLikedUser] = useState({});
  const [TextForSend, SetTextForSend] = useState();
  const [CheckForAddComment, SetCheckForAddComment] = useState({});
  const [CheckForshowComment, SetCheckForshowComment] = useState({});
  const [showc, setshowc] = useState(false);
  const [allusername, SetAllUsername] = useState();
  // eslint-disable-next-line
  const [idr,setidr]=useState(null)
  const [AllCommentDeatils, SetAllCommentDeatils] = useState(null);
  async function fetchTweetDetails() {
    try {
      const response = await axios.post(
        `${api}/tweet/alltweet`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const initialLikedUserStatus = response.data.data.reduce((acc, tweet) => {
        acc[tweet._id] = 0;
        return acc;
      }, {});
      setLikedUser(initialLikedUserStatus);
      setMyTweets(response.data.data);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  }
  async function FetchUsername() {
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
    SetAllUsername(data.data.data);
  }
  useEffect(() => {
    fetchTweetDetails();
    FetchUsername();
    // eslint-disable-next-line
  }, []);

  // Handle tweet actions
  async function handleTweetAction(id, actionType) {
    dispatch(setuserid(id));
    navigate(`/tweet/${actionType}`);
  }

  // Remove likes
  async function removeLikes(id) {
    try {
      // eslint-disable-next-line
      const data = await axios.post(
        `${api}/likes/remove`,
        { whichtweet: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Reload tweets after removing likes
      fetchTweetDetails();
    } catch (error) {
      console.error("Error removing likes:", error);
    }
  }

  // Add likes
  async function addLikes(id) {
    try {
      // eslint-disable-next-line
      const data = await axios.post(
        `${api}/likes/add`,
        { whichtweet: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Reload tweets after adding likes
      fetchTweetDetails();
    } catch (error) {
      console.error("Error adding likes:", error);
    }
  }
  async function changer(id) {
    setLikedUser((prev) => ({ ...prev, [id]: !LikedUser[id] }));
  }
  function backer() {
    navigate("/");
  }
  async function AddComment(id) {
    // eslint-disable-next-line
    const responce = await axios.post(
      `${api}/comments/add`,
      {
        textabout: TextForSend,
        underwhichtweet: id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    SetCheckForAddComment((prev) => ({
      ...prev,
      [id]: !CheckForAddComment[id],
    }));
  }
  async function ShowComment(id) {
    // eslint-disable-next-line
    setshowc((prev) => !prev);
    // SetCheckForshowComment((prev) => ({
    //   ...prev,
    //   [id]: !CheckForshowComment[id],
    // }));

    const responce = await axios.post(
      `${api}/comments/show`,
      {
        tweetid: id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    setidr(id)
    SetAllCommentDeatils(responce.data.data);
  }
  async function mdr(id) {
    SetCheckForshowComment((prev) => ({
      ...prev,
      [id]: !CheckForshowComment[id],
    }));
  }

  async function addundercomment(id1, id2) {
    // eslint-disable-next-line
    const responce = await axios.post(
      `${api}/comments/add`,
      {
        textabout: TextForSend,
        underwhichtweet: id2,
        underwhichcomment: id1,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    SetCheckForAddComment((prev) => ({
      ...prev,
      [id1]: !CheckForAddComment[id1],
    }));
  }
  async function ShowCommentComponent(datafor, idfor) {
    const data = datafor;
    const mainid = idfor;
  
    if (!data || !data.length) {
      return <div>None</div>;
    }
    const comments = await
      data.map(async (comment) => {
           <div>{comment._id}</div>
          const mc =  await comment?.map(async(morecomments)=>{
             <div key={morecomments?._id} className="mb-4">
             <div className="font-bold">{allusername[morecomments._id]}</div>
             <div className="mb-2">{morecomments.textcomment}</div>
             <div>
               <Button
                 onClick={() =>
                   SetCheckForAddComment((prev) => ({
                     ...prev,
                     [morecomments._id]: !CheckForAddComment[morecomments._id],
                   }))
                 }
               >
                 Add comment to replay
               </Button>
               {CheckForAddComment[morecomments._id] === true && (
                 <div className="mt-2">
                   <Input
                     type="text"
                     placeholder="add replay"
                     onChange={(e) => SetTextForSend(e.target.value)}
                   />
                   <Button
                     type="submit"
                     colorScheme="teal"
                     mt="2"
                     onClick={() => addundercomment(morecomments._id, mainid)}
                   >
                     add comment to replay
                   </Button>
                 </div>
               )}
             </div>
   
             <div className="mt-4">
               <Button onClick={() => mdr(morecomments._id)}>
                 {CheckForshowComment[morecomments._id] === true
                   ? "Hide Comment"
                   : "Show Comment"}
               </Button>
               {CheckForshowComment[morecomments._id] === true &&
                 morecomments.reply &&
                 (await ShowCommentComponent(morecomments.reply, mainid))}
             </div>
           </div>
           return <div>{comments}</div>
          })
       return <div className="p-4">{mc}</div>;  
      })
    return null;
  }
  return (
    <div>
      <Navbar/>
   
    <div className="container mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <Button onClick={() => backer()}>Back</Button>
      <div className="text-2xl font-bold mb-4">All Tweets</div>
      {myTweets.length ? (
        <List spacing={4}>
          {myTweets.map((tweet) => (
            <ListItem key={tweet._id} p={4} rounded="md" borderWidth="1px">
              <Box>
                <div className="text-xl font-semibold mb-2">
                  {tweet?.tweetabout}
                </div>
                <div className="flex items-center space-x-2">
                  <span>{tweet?.totallikes}</span>
                  {tweet?.LikedByme ? (
                    <Button
                      onClick={() => removeLikes(tweet._id)}
                      colorScheme="red"
                    >
                      Remove Like
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addLikes(tweet._id)}
                      colorScheme="blue"
                    >
                      Add Like
                    </Button>
                  )}
                </div>
                <div className="mt-2">
                  <Button
                    onClick={() => changer(tweet._id)}
                    colorScheme="blue"
                    variant="link"
                  >
                    {LikedUser[tweet._id]
                      ? "Hide Users"
                      : "Show Users who Liked"}
                  </Button>
                </div>
                {LikedUser[tweet._id] && (
                  <Box mt={2}>
                    <List>
                      {tweet.likestweetuser.map((user1) => (
                        <ListItem key={user1._id}>
                          <div className="text-gray-700">{user1.username}</div>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                <Button
                  onClick={() =>
                    SetCheckForAddComment((prev) => ({
                      ...prev,
                      [tweet._id]: !CheckForAddComment[tweet._id],
                    }))
                  }
                  colorScheme="blue"
                >
                  Add comment
                </Button>
                {CheckForAddComment[tweet._id] && (
                  <div>
                    <Textarea
                      onChange={(e) => SetTextForSend(e.target.value)}
                      placeholder="Enter comment"
                      mt={2}
                    />
                    <Button
                      type="submit"
                      onClick={() => AddComment(tweet._id)}
                      colorScheme="blue"
                      mt={2}
                    >
                      Submit
                    </Button>
                  </div>
                )}
                <Button onClick={() => ShowComment(tweet._id)} mt={2}>
                  {showc ? "Hide Comment" : "Show Comment"}
                </Button>
                <Collapse in={showc}>
                  <Box mt={2}>
                    {
                      AllCommentDeatils && AllCommentDeatils.length>0 && ShowCommentComponent(AllCommentDeatils,tweet._id)
                    }
                  </Box>
                </Collapse>
                {tweet.ControlByme && (
                  <div className="flex space-x-4 mt-4">
                    <Button
                      colorScheme="blue"
                      onClick={() => handleTweetAction(tweet._id, "update")}
                    >
                      Update
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleTweetAction(tweet._id, "delete")}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <p className="text-gray-500">No tweets to display.</p>
      )}
    </div>
    </div>
  );
}
