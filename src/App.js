import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/SignUp";
import Login from "./Login/Login";
import ForgotPasswordPage from "./Forgot/ForgotPage";
import NewPasswordPage from "./Forgot/NewPasswordPage";
import Profile from "./Profile/Profile";
import AddTweet from "./Home/AddTweet";
import ShowTweet from "./Home/ShowTweet";
import DeleteTweet from "./Home/DeleteTweet";
import UpdateTweet from "./Home/UpdateTweet";
import ShowAllTweet from "./Home/ShowAllTweet";
import ProfileSeen from "./Profile/ProfileSeen";
import SearchBar from "./SearchBar/SearchBar";
import Follow from "./Following_And_Follow/Follow";
import Following from "./Following_And_Follow/Following";
import ChatBox from "./Chat/ChatBox";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/NewPassword" element={<NewPasswordPage />} />
        <Route path="/ProfileUpdate" element={<Profile />} />
        <Route path="/tweet/add" element={<AddTweet />} />
        <Route path="/tweet/show" element={<ShowTweet />} />
        <Route path="/tweet/delete" element={<DeleteTweet />} />
        <Route path="/tweet/update" element={<UpdateTweet />} />
        <Route path="/tweet" element={<ShowAllTweet />} />
        <Route path="/Profile/:userId" element={<ProfileSeen />} />
        <Route path="/searchbar" element={<SearchBar />} />
        <Route path="/follow/:userId" element={<Follow />} />
        <Route path="/following/:userId" element={<Following />} />
        <Route path="/chatbox" element={<ChatBox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
