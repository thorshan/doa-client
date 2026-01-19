import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  People,
  HotelClass,
  SentimentDissatisfied,
  Description,
  TextSnippet,
  GradeRounded,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 280;

const Sidebar = () => {
  const theme = useTheme();
  const [openSubmenu, setOpenSubmenu] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const handleSubmenuClick = () => {
    setOpenSubmenu(!openSubmenu);
  };

  const handleRoute = (path, text) => {
    setActiveItem(text);
    navigate(path);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, type: "item" },
    { text: "Users", icon: <People />, type: "item", path: "/admin/users" },
    {
      text: "Chapters",
      icon: <GradeRounded />,
      type: "item",
      path: "/admin/chapters",
    },
    {
      text: "Exams",
      icon: <GradeRounded />,
      type: "item",
      path: "/admin/exams",
    },
    {
      text: "Questions",
      icon: <GradeRounded />,
      type: "item",
      path: "/admin/questions",
    },
    {
      text: "Modules",
      icon: <Description />,
      type: "item",
      path: "/admin/modules",
    },
    {
      text: "Lessons",
      icon: <TextSnippet />,
      type: "item",
      path: "/admin/lessons",
    },
    {
      text: "Level",
      icon: <HotelClass />,
      type: "item",
      path: "/admin/levels",
    },
    {
      text: "Kanji",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/kanji",
    },
    {
      text: "Vocabulary",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/vocabularies",
    },
    {
      text: "Grammar",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/grammars",
    },
    {
      text: "Renshuu A",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/renshuua",
    },
    {
      text: "Renshuu B",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/renshuub",
    },
    {
      text: "Renshuu C",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/renshuuc",
    },
    {
      text: "Speaking",
      icon: <SentimentDissatisfied />,
      type: "item",
      path: "/admin/speakings",
    },
    {
      text: "Reports",
      icon: <BarChartIcon />,
      type: "submenu",
      children: [{ text: "Sales Performance" }, { text: "Traffic Insights" }],
    },
    { text: "Integrations", icon: <LayersIcon />, type: "item" },
  ];

  const isParentActive = (item) => {
    if (item.type === "item") return activeItem === item.text;
    if (item.type === "submenu") {
      return item.children.some((child) => child.text === activeItem);
    }
    return false;
  };

  const mainItemStyles = (isActive) => ({
    position: "relative",
    mb: 0.5,
    pl: 3,
    transition: "all 0.2s ease-in-out",
    backgroundColor: isActive
      ? alpha(theme.palette.primary.main, 0.1)
      : "transparent",
    color: isActive ? "primary.main" : "text.secondary",
    "&:hover": {
      backgroundColor: isActive
        ? "transparent"
        : alpha(theme.palette.primary.main, 0.1),
      color: "primary.main",
      "& .main-indicator": {
        height: "100%",
        opacity: 1,
      },
    },
    "& .main-indicator": {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: "4px",
      height: isActive ? "70%" : "0%",
      backgroundColor: theme.palette.primary.main,
      borderRadius: "0 4px 4px 0",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: isActive ? 1 : 0,
    },
  });

  // Sublink Item Styles (Full height vertical line)
  const sublinkItemStyles = (isActive) => ({
    position: "relative",
    borderRadius: "0 8px 8px 0",
    mb: 0,
    pl: 7.5,
    py: 1.2,
    transition: "all 0.2s ease-in-out",
    color: isActive ? "primary.main" : "text.secondary",
    backgroundColor: isActive
      ? alpha(theme.palette.primary.main, 0.1)
      : "transparent",
    "&:hover": {
      backgroundColor: isActive
        ? "transparent"
        : alpha(theme.palette.primary.main, 0.1),
      color: "primary.main",
      "& .sub-indicator": {
        backgroundColor: "primary.main",
        width: "3px",
      },
    },
    // The Vertical Line (Full Height)
    "& .sub-indicator": {
      position: "absolute",
      left: 36, // Centered under the parent icon
      top: 0,
      bottom: 0,
      width: "1.5px",
      backgroundColor: isActive ? theme.palette.primary.main : "divider",
      transition: "all 0.2s ease-in-out",
      zIndex: 1,
      "&:hover": {
        "& .main-indicator": {
          height: "100%",
          opacity: 1,
        },
      },
    },
  });

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              width: 32,
              height: 32,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LayersIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            DOA Admin
          </Typography>
        </Box>
      </Toolbar>

      <List component="nav" sx={{ pt: 2, pr: 0 }}>
        {menuItems.map((item) => {
          const isActive = activeItem === item.text;
          const parentActive = isParentActive(item);

          if (item.type === "item") {
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleRoute(item.path, item.text)}
                  sx={mainItemStyles(isActive)}
                >
                  <Box className="main-indicator" />
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }

          return (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleSubmenuClick}
                  sx={mainItemStyles(parentActive && !openSubmenu)}
                >
                  <Box className="main-indicator" />
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: parentActive ? 600 : 500,
                    }}
                  />
                  {openSubmenu ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <ExpandMore fontSize="small" />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={openSubmenu} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  sx={{ position: "relative" }}
                >
                  {item.children.map((child) => {
                    const isChildActive = activeItem === child.text;
                    return (
                      <ListItemButton
                        key={child.text}
                        onClick={() => setActiveItem(child.text)}
                        sx={sublinkItemStyles(isChildActive)}
                      >
                        <Box className="sub-indicator" />
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{
                            fontSize: "0.85rem",
                            fontWeight: isChildActive ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 3 }}>
        <Typography
          variant="overline"
          sx={{
            px: 1,
            fontWeight: 700,
            color: "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          Management
        </Typography>
        <List component="nav" sx={{ mt: 1 }}>
          {["Settings", "Messages"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => setActiveItem(text)}
                sx={mainItemStyles(activeItem === text)}
              >
                <Box className="main-indicator" />
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  {text === "Settings" ? <SettingsIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
  return (
    <Box>
      <Drawer>{drawerContent}</Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
