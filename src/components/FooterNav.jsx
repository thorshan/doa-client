import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ArchiveRounded,
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
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 12,
        left: 0,
        right: 0,
        mx: "auto",
        width: "95%",
        borderRadius: 4,
        backdropFilter: "blur(12px)",
        background: theme.palette.primary.main + "20",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }}
      elevation={4}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{
          borderRadius: 4,
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
          href="/"
          label={translations[language].home}
          icon={<HomeRounded />}
        />
        {/* <BottomNavigationAction
          href="/user/archives"
          sx={{
            "& .MuiBottomNavigationAction-label": { fontSize: 10 },
          }}
          label={translations[language].archive || "Archives"}
          icon={<ArchiveRounded />}
        /> */}
        <BottomNavigationAction
          href="/search"
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
