import {
  alpha,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from "@mui/material";
import {
  HomeRounded,
  SearchRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { useState } from "react";
import { translations } from "../constants/translations";
import { useLanguage } from "../context/LanguageContext";

const FooterNav = () => {
  const { language } = useLanguage();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const glassBackground = alpha(theme.palette.primary.footer, 0.3);
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 12,
        left: 0,
        right: 0,
        mx: "auto",
        width: "90%",
        borderRadius: 5,
        backdropFilter: "blur(15px)",
        background: glassBackground,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        border: "0.5px solid rgba(255, 255, 255, 0.1)",
      }}
      elevation={4}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{
          borderRadius: 5,
          background: "transparent",
          "& .MuiBottomNavigationAction-root": {
            color: theme.palette.primary.dark + "99",
            transition: "0.3s",
          },
          "& .Mui-selected": {
            color: theme.palette.primary.main,
          },
        }}
      >
        <BottomNavigationAction
          sx={{
            "& .MuiBottomNavigationAction-label": { fontSize: 10 },
          }}
          href="/home"
          label={translations[language].home}
          icon={<HomeRounded />}
        />
        <BottomNavigationAction
          href="/reading/search"
          sx={{
            "& .MuiBottomNavigationAction-label": { fontSize: 10 },
          }}
          label={translations[language].search}
          icon={<SearchRounded />}
        />
        <BottomNavigationAction
          sx={{
            "& .MuiBottomNavigationAction-label": { fontSize: 10 },
          }}
          href="/settings"
          label={translations[language].settings}
          icon={<SettingsRounded />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default FooterNav;
