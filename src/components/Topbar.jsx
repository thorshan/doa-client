// import { useMediaQuery, useTheme } from "@mui/material";
import {
  AppBar,
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useColorMode } from "../context/ThemeContext";
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Notifications,
  Search,
  Translate,
} from "@mui/icons-material";

const drawerWidth = 280;

const Topbar = () => {
  const theme = useTheme();
  //   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const path =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  const { toggleColorMode } = useColorMode();
  
  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: "primary.main",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={600}>
          {path.charAt(0).toUpperCase() + path.slice(1)}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton>
            <Search sx={{ color: "white" }} />
          </IconButton>
          <IconButton>
            <Notifications sx={{ color: "white" }} />
          </IconButton>
          <IconButton onClick={toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <Brightness7 sx={{ color: "white" }} />
            ) : (
              <Brightness4 sx={{ color: "white" }} />
            )}
          </IconButton>
          <IconButton>
            <AccountCircle sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
