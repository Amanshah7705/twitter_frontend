import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  createTheme, // Import createTheme from @mui/material/styles
  ThemeProvider, // Import ThemeProvider from @mui/material/styles
} from "@mui/material";
import { Image } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setFollowid } from "../redux/listSlice.js";
import { setFollowingid } from "../redux/listSlice.js";
import Navbar from "../Home/Home.js";

// Create a theme using createTheme
const theme = createTheme({
  spacing: 4,
  palette: {
    primary: {
      main: "#007bff",
    },
  },
});

export default function ProfileSeen() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [DataForDisplay, SetDataForDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [StateChange, SetStateChange] = useState(0);

  async function FetchDetails() {
    try {
      const response = await axios.post(
        `${api}/users/profile-details`,
        { id_for_deatils: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      SetDataForDisplay(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching details:", error);
      // Handle error as needed
    }
  }

  useEffect(() => {
    FetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StateChange]);

  function handleBack() {
    navigate("/");
  }

  async function changeFollow(id) {
    // eslint-disable-next-line
    const data = await axios.post(
      `${api}/users/FollowTo`,
      { followto: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    SetStateChange((prev) => prev + 1);
  }

  async function changeUnfollow(id) {
    // eslint-disable-next-line
    const data = await axios.post(
      `${api}/users/UnFollowTo`,
      { unfollow: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    SetStateChange((prev) => prev + 1);
  }

  async function handleFollow() {
    const followCount = DataForDisplay[0]?.TotalFollowPart[0]?.follow || 0;
    dispatch(setFollowid(followCount));
    navigate(`/follow/${userId}`);
  }

  async function handleFollowing() {
    const followersCount =
      DataForDisplay[0]?.TotalFollowingPart[0]?.followers || 0;
    dispatch(setFollowingid(followersCount));
    navigate(`/following/${userId}`);
  }

  return (
    <div>
      <Navbar/>
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" className="mt-4">
        <Button className="mb-4" onClick={handleBack}>
          Back
        </Button>
        {loading ? (
          <CircularProgress />
        ) : DataForDisplay && DataForDisplay.length > 0 ? (
          <Grid container spacing={3}>
            {DataForDisplay.map((userData) => (
              <Grid item key={userData._id} xs={12} md={6} lg={4}>
                <Card className="bg-white shadow-md rounded-md p-4">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Username
                    </Typography>
                    <Typography variant="subtitle1" className="font-bold">
                      {userData.username}
                    </Typography>
                    <Button className="mt-2" onClick={handleFollow}>
                      Follow: {userData.TotalFollow}
                    </Button>
                    <Button className="mt-2" onClick={handleFollowing}>
                      Following: {userData.TotalFollowing}
                    </Button>
                    <Typography variant="h6" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body1">{userData.email}</Typography>
                    {userData.IFollowedHim === false ? (
                      <div className="mt-2">
                        <Button onClick={() => changeFollow(userData._id)}>
                          Follow Him
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <Button onClick={() => changeUnfollow(userData._id)}>
                          Unfollow Him
                        </Button>
                      </div>
                    )}
                    <Typography variant="h6" gutterBottom>
                      Bio
                    </Typography>
                    <Typography variant="body1">
                      {userData?.userextraField[0]?.bio}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {userData?.userextraField[0]?.location}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Profile Picture
                    </Typography>
                    <Image
                      src={userData?.userextraField[0]?.profile_picture}
                      alt="Profile"
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}
      </Container>
    </ThemeProvider>
    </div>
  );
}
