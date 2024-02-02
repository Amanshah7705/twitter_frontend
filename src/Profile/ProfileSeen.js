import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { Image } from '@chakra-ui/react';

export default function ProfileSeen() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const accessToken = Cookies.get('accessToken');
  const navigate = useNavigate();
  const { userId } = useParams();
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
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.data);
      SetDataForDisplay(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      // Handle error as needed
    }
  }

  useEffect(() => {
    FetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StateChange]);

  function handleBack() {
    navigate('/');
  }

  async function changeFollow(id) {
    const data = await axios.post(
      `${api}/users/FollowTo`,
      { followto: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(data);
    SetStateChange((prev) => prev + 1);
  }

  async function changeUnfollow(id) {
    const data = await axios.post(
      `${api}/users/UnFollowTo`,
      { unfollow: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(data);
    SetStateChange((prev) => prev + 1);
  }

  return (
    <Container maxWidth="md" className="mt-4">
      <Button className="mb-4" onClick={handleBack}>
        Back
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        DataForDisplay && (
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
                    <Button className="mt-2">
                      Follow: {userData.TotalFollow}
                    </Button>
                    <Button className="mt-2">
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
        )
      )}
    </Container>
  );
}
