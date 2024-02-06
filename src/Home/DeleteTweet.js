import React from "react";
import { useSelector } from "react-redux";
import { selectuserid } from "../redux/useridslice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeleteTweet.css";
import Navbar from "./Home";

export default function DeleteTweet() {
  const id = useSelector(selectuserid);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const api = process.env.REACT_APP_BACKEND_URL;

  async function ForFetchPercularTweet() {
    // eslint-disable-next-line
    const data = await axios.post(
      `${api}/tweet/delete`,
      { id_for_delete: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    navigate("/tweet/show");
  }

  return (
    <div>
      <Navbar/>
    <div className="container mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Are You Sure You Want to Delete This?
      </h2>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
        type="submit"
        onClick={ForFetchPercularTweet}
      >
        Delete
      </button>
    </div>
    </div>

  );
}
