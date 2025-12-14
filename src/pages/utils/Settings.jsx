import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Brightness4,
  Brightness7,
  NavigateNextRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import LanguageToggler from "../../components/LangToggler";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import { API } from "../../constants/API";

const Settings = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const { language } = useLanguage();
  const [openDialog, setOpenDialog] = useState(false);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <Box sx={{ p: { sm: 3, xs: 2 } }}>
      <Stack direction={"row"} spacing={{ sm: 3, xs: 1 }}>
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={<ArrowBack />}
          sx={{ textTransform: "none" }}
          onClick={handleBack}
        >{translations[language].go_back}</Button>
        <Typography
          variant="h6"
          fontWeight={{ sm: "bold" }}
          color="text.primary"
          sx={{ mt: 3 }}
        >
          {translations[language].settings}
        </Typography>
      </Stack>
      <Box>
        {isAuthenticated && (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              mt: 3,
              height: 90,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
              <Avatar src={`${API}${user?.image?.filePath}`}>{user?.name?.[0]}</Avatar>
              <Typography variant="subtitle1" sx={{ ml: 2}}>{user?.name}</Typography>
            </Box>
            <Button
              variant="text"
              color="primary"
              endIcon={<NavigateNextRounded sx={{ ml: 0.5 }} />}
              onClick={() => navigate(`/${user.name}/profile`, {state: {id: user._id}})}
            >
              {translations[language].profile}
            </Button>
          </Paper>
        )}
        <Paper
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            mt: 3,
            height: 50
          }}
        >
          <Typography variant="subtitle1">
            {translations[language].theme}
          </Typography>
          <IconButton onClick={toggleColorMode} color="primary">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Paper>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            mt: 3,
            height: 50 
          }}
        >
          <Typography variant="subtitle1">
            {translations[language].language}
          </Typography>
          <LanguageToggler />
        </Paper>
        {isAuthenticated && (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              mt: 3,
              height: 50,
            }}
          >
            <Typography variant="subtitle1">
              {translations[language].account || "Account"}
            </Typography>
            <Button
              variant="text"
              color="error"
              onClick={() => setOpenDialog(true)}
            >
              {translations[language].logout}
            </Button>
          </Paper>
        )}
      </Box>

      {/* Confirm Dialog */}
      {isAuthenticated && (
        <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={logout}
      />
      )}
    </Box>
  );
};

export default Settings;
