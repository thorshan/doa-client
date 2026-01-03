import { useEffect, useState } from "react";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
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
  VerifiedUser,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { userApi } from "../../api/userApi";
import { API } from "../../constants/API";
import { LEVEL } from "../../constants/level";
import { useAuth } from "../../context/AuthContext";
import VerifyEmail from "./VerifyEmail";

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userApi.getUser(user._id);
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

  const langLevel = Object.keys(LEVEL).map((lang) => LEVEL[lang]);

  const userCurrent = langLevel.indexOf(userData?.level?.current);
  const safeTabValue = userCurrent >= 0 ? userCurrent : 0;
  const passedLevels = userData?.level?.passed ?? [];

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
          src={`${API}${userData.image?.filePath}`}
          sx={{ width: 80, height: 80, fontSize: 45 }}
        >
          {userData.name?.[0]}
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
              {userData?.name}
            </Typography>
            {userData.isEmailVerified ? (
              <VerifiedUser color="primary" sx={{ ml: 2 }} />
            ) : (
              <Button
                href={`/app/${user._id}/verify`}
                sx={{
                  border: 0.5,
                  py: 0,
                  borderRadius: 5,
                  borderStyle: "dashed",
                  ml: 2,
                }}
              >
                Verify Email
              </Button>
            )}

            <VerifiedRounded color="primary" sx={{ ml: 1 }} />
          </Box>
          <Typography variant="caption">{userData?.email}</Typography>
          <Typography variant="caption">
            {"@"}
            {userData?.username}
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
              value={safeTabValue}
              scrollButtons={false}
              variant="scrollable"
              allowScrollButtonsMobile
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                mt: 1,
                "& .MuiTabs-scroller": {
                  overflowY: "none",
                  py: 1.5,
                },
              }}
            >
              {langLevel.map((lang, index) => (
                <Badge
                  key={lang}
                  color="action.active"
                  overlap="circular"
                  badgeContent={
                    passedLevels.includes(lang) ? (
                      <StarRounded fontSize="small" />
                    ) : (
                      0
                    )
                  }
                >
                  <Tab
                    label={lang}
                    icon={
                      passedLevels.includes(lang) ? (
                        <WorkspacePremiumRounded />
                      ) : safeTabValue === index ? (
                        <TrendingUpRounded />
                      ) : (
                        <DoDisturb />
                      )
                    }
                    iconPosition="end"
                    disabled={safeTabValue < index}
                    sx={{
                      textTransform: "none",
                      borderRadius: 5,
                      px: 2,
                      py: 0.5,
                      minHeight: 40,
                      mr: 1,
                      backgroundColor:
                        safeTabValue === index
                          ? alpha(theme.palette.primary.main, 1)
                          : alpha(theme.palette.action.hover, 0.1),
                      fontWeight: safeTabValue === index ? 600 : 400,
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
