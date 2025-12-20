import { useEffect, useState } from "react";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  DoDisturb,
  EditSquare,
  StarRounded,
  TrendingUpRounded,
  VerifiedRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { userApi } from "../../api/userApi";
import { API } from "../../constants/API";
import { LEVEL } from "../../constants/level";

const Profile = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUserData] = useState({});
  const theme = useTheme();
  const langLevel = Object.keys(LEVEL).map((lang) => LEVEL[lang]);
  const userCurrent = Object.keys(LEVEL)
    .map((lang) => LEVEL[lang])
    .indexOf(user?.level);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<ArrowBack />}
            sx={{ textTransform: "none", mr: 2 }}
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
        </Box>
        <IconButton href={`/app/${user._id}/profile/edit`}>
          <EditSquare />
        </IconButton>
      </Box>
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
          sx={{ width: 80, height: 80, fontSize: 45 }}
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={"bold"}>
              {user?.name}
            </Typography>
            <VerifiedRounded color="primary" sx={{ ml: 1 }} />
          </Box>
          <Typography variant="caption">{user?.email}</Typography>
          <Typography variant="caption">
            {"@"}
            {user?.username}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ my: 3 }}>
        <Stack spacing={3} direction={"column"}>
          <Box>
            <Typography variant="h6">
              {translations[language].japanese_level}
            </Typography>
            <Tabs
              value={userCurrent}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                mt: 1,
                "& .MuiTabs-scroller": {
                  overflowY: "none",
                  py: 1.5
                },
              }}
            >
              {langLevel.map((lang, index) => (
                <Badge
                  key={index}
                  badgeContent={<StarRounded fontSize="small"/>}
                  color="primary"
                  overlap="circular"
                >
                  <Tab
                    key={index}
                    label={lang}
                    icon={
                      userCurrent === index ? (
                        <TrendingUpRounded />
                      ) : userCurrent > index ? (
                        <WorkspacePremiumRounded />
                      ) : (
                        <DoDisturb />
                      )
                    }
                    iconPosition="end"
                    disabled={userCurrent < index}
                    sx={{
                      textTransform: "none",
                      border: 1,
                      borderColor: "primary.main",
                      borderRadius: 5,
                      px: 2,
                      py: 0.5,
                      minHeight: 40,
                      mr: 1,
                      backgroundColor:
                        userCurrent === index
                          ? alpha(theme.palette.primary.main, 0.3)
                          : alpha(theme.palette.action.hover, 0.1),
                      color:
                        userCurrent === index ? "text.primary" : "text.primary",
                      fontWeight: userCurrent === index ? 600 : 400,
                      "&:hover": {
                        bgcolor:
                          userCurrent === index
                            ? "primary.dark"
                            : "action.hover",
                      },
                    }}
                  />
                </Badge>
              ))}
            </Tabs>
          </Box>
          <Typography variant="h6">Achievements</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
