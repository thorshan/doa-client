import React from "react";
import { useAuth } from "../../context/AuthContext";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

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
          {translations[language]?.back || "Back"}
        </Button>
        <Typography
          variant="h6"
          fontWeight={{ sm: "bold" }}
          color="text.primary"
        >
          {user.name}
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
        <Avatar sx={{ width: 80, height: 80 }}></Avatar>
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
