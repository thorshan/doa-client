import { alpha, Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { translations } from "../constants/translations";
import { useLanguage } from "../context/LanguageContext";
import { userApi } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Options = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = localStorage.getItem("lang");
  const theme = useTheme();
  const [userData, setUser] = useState({ user });
  const level = "Basic";

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getUserData(user?._id);
        setUser(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUser();
  }, [user]);

  // Handle Back
  const handleBack = () => {
    navigate(-1);
  };

  // Handle Beginner
  const handleBeginner = async () => {
    navigate("/app");
  };

  // Handle Basic Finish
  const handleBasic = async () => {
    try {
      const res = await userApi.updateUserLevel(userData?._id, { level });
      console.log(res.data);
      navigate("/app");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          width: "100%",
          maxWidth: 500,
          border: 1,
          borderColor: "primary.main",
          borderRadius: 5,
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {translations[language].choose}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: "primary.main",
              borderRadius: 5,
              minWidth: 200,
              backgroundColor: "background.default",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 90,
              p: 2,
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
                transform: "scale(1.05)",
                transition: "0.3s",
              },
            }}
            component={"button"}
            onClick={handleBeginner}
          >
            <Typography variant="h6" color="text.primary">
              {lang === "jp" ? (
                <>完全な初心者</>
              ) : lang === "mm" ? (
                <>အပြည့်အဝ အခြေခံအဆင့်</>
              ) : (
                <>Absolute Beginer</>
              )}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{
                p: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 5,
              }}
            >
              {lang === "jp" ? (
                <>基礎から学び始めます</>
              ) : lang === "mm" ? (
                <>အခြေခံအကျဆုံးကနေစပြီး သင်ယူရမှာဖြစ်ပါတယ်</>
              ) : (
                <>You will start learning from the very basic</>
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              border: 1,
              borderColor: "primary.main",
              borderRadius: 5,
              minWidth: 200,
              backgroundColor: "background.default",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 90,
              p: 2,
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
                transform: "scale(1.05)",
                transition: "0.3s",
              },
            }}
            component={"button"}
            onClick={handleBasic}
          >
            <Typography variant="h6" color="text.primary">
              {lang === "jp" ? (
                <>基本的なことは知っている</>
              ) : lang === "mm" ? (
                <>အခြေခံကိုနားလည်ပါတယ်</>
              ) : (
                <>Know Basic</>
              )}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{
                p: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 5,
              }}
            >
              {lang === "jp" ? (
                <>基礎から学び始めます</>
              ) : lang === "mm" ? (
                <>N5 ကနေစပြီး သင်ယူရမှာဖြစ်ပါတယ်</>
              ) : (
                <>You will start learning from N5 level</>
              )}
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={handleBack}
          variant="contained"
          sx={{ mt: 3, borderRadius: 5 }}
        >
          {translations[language].go_back}
        </Button>
      </Box>
    </Box>
  );
};

export default Options;
