import { useEffect, useState } from "react";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { userApi } from "../../api/userApi";
import { API } from "../../constants/API";

const Profile = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userApi.getUser(location.state?.id);
        setUserData(res.data);
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    };
    fetchUserData();
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <Box sx={{ p: { sm: 3, xs: 2 } }}>
      <Stack direction="row" spacing={{ sm: 3, xs: 2 }} alignItems="center">
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={<ArrowBack />}
          sx={{ textTransform: "none" }}
          onClick={handleBack}
        >
          {translations[language].go_back}
        </Button>
        <Typography
          variant="h6"
          fontWeight={{ sm: "bold" }}
          color="text.primary"
        >
          {translations[language].profile}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Avatar
          src={`${API}${user.image?.filePath}`}
          sx={{ width: 80, height: 80 }}
        >
          {user.name?.[0]}
        </Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            ml: 2,
          }}
        >
          <Typography variant="subtitle1">{user?.name}</Typography>
          <Typography variant="caption">{user?.email}</Typography>
          <Typography variant="caption">
            {"@"}
            {user?.username}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        href={`/${user._id}/profile/edit`}
        fullWidth
      >
        {translations[language].edit_profile}
      </Button>
      <Box sx={{ my: 3 }}>
        <Stack spacing={2} direction={"column"}>
          <Typography variant="h6">Achievements</Typography>
          <Typography variant="h6">Archived</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
