import { BrowserRouter, Routes,Route } from 'react-router-dom';
import Home from './Home/Home';
import Signup from './Signup/SignUp';
import Login from './Login/Login';
import ForgotPasswordPage from './Forgot/ForgotPage';
import NewPasswordPage from './Forgot/NewPasswordPage';
import Profile from './Profile/Profile';
import AddTweet from './Home/AddTweet';
import ShowTweet from './Home/ShowTweet';
import DeleteTweet from './Home/DeleteTweet';
import UpdateTweet from './Home/UpdateTweet';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/Login' element ={<Login/>} />
      <Route path='/ForgotPassword' element={<ForgotPasswordPage/>}/>
      <Route path='/NewPassword' element={<NewPasswordPage/>}/>
      <Route path='/Profile' element={<Profile/>}/>
      <Route path='/tweet/add' element={<AddTweet/>}/>
      <Route path='/tweet/show' element={<ShowTweet/>}/>
      <Route path='/tweet/delete' element={<DeleteTweet/>}/>
      <Route path='/tweet/update' element={<UpdateTweet/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
