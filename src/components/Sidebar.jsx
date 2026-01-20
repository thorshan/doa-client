import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  People,
  HotelClass,
} from "@mui/icons-material";

const drawerWidth = 280;

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // 1. Fix: Use an object to track which specific submenus are open
  const [openSubmenus, setOpenSubmenus] = useState({
    Course: true,
    Chapters: false,
    Tests: false,
  });
  
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Toggle specific submenu
  const handleSubmenuClick = (menuText) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };

  const handleRoute = (path, text) => {
    setActiveItem(text);
    if (path) navigate(path);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, type: "item", path: "/admin" },
    { text: "Users", icon: <People />, type: "item", path: "/admin/users" },
    { text: "Level", icon: <HotelClass />, type: "item", path: "/admin/levels" },
    {
      text: "Course",
      icon: <LayersIcon />,
      type: "submenu",
      children: [
        { text: "Modules", path: "/admin/modules" },
        { text: "Chapters", path: "/admin/chapters" },
      ],
    },
    {
      text: "Chapters",
      icon: <LayersIcon />,
      type: "submenu",
      children: [
        { text: "Kanji", path: "/admin/kanji" },
        { text: "Vocabulary", path: "/admin/vocabularies" },
        { text: "Grammar", path: "/admin/grammars" },
        { text: "Renshuu A", path: "/admin/renshuua" },
        { text: "Renshuu B", path: "/admin/renshuub" },
        { text: "Renshuu C", path: "/admin/renshuuc" },
        { text: "Speaking", path: "/admin/speakings" },
      ],
    },
    {
      text: "Tests",
      icon: <LayersIcon />,
      type: "submenu",
      children: [
        { text: "Exams", path: "/admin/exams" },
        { text: "Questions", path: "/admin/questions" },
      ],
    },
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
    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : "transparent",
    color: isActive ? "primary.main" : "text.secondary",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      color: "primary.main",
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
      transition: "all 0.3s ease",
      opacity: isActive ? 1 : 0,
    },
  });

  const sublinkItemStyles = (isActive) => ({
    position: "relative",
    pl: 7.5,
    py: 1,
    color: isActive ? "primary.main" : "text.secondary",
    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.05) : "transparent",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    "& .sub-indicator": {
      position: "absolute",
      left: 36,
      top: 0,
      bottom: 0,
      width: "1.5px",
      backgroundColor: isActive ? theme.palette.primary.main : theme.palette.divider,
    },
  });

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: "primary.main", width: 32, height: 32, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LayersIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>DOA Admin</Typography>
        </Box>
      </Toolbar>

      <List component="nav" sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = activeItem === item.text;
          const parentActive = isParentActive(item);
          const isSubmenuOpen = openSubmenus[item.text];

          if (item.type === "item") {
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => handleRoute(item.path, item.text)} sx={mainItemStyles(isActive)}>
                  <Box className="main-indicator" />
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          }

          return (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSubmenuClick(item.text)} sx={mainItemStyles(parentActive)}>
                  <Box className="main-indicator" />
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: parentActive ? 600 : 500 }} />
                  {isSubmenuOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
              </ListItem>
              <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton key={child.text} onClick={() => handleRoute(child.path, child.text)} sx={sublinkItemStyles(activeItem === child.text)}>
                      <Box className="sub-indicator" />
                      <ListItemText primary={child.text} primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: activeItem === child.text ? 600 : 400 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 3 }}>
        <Typography variant="overline" sx={{ px: 1, fontWeight: 700, color: "text.secondary", fontSize: "0.7rem" }}>Management</Typography>
        <List component="nav" sx={{ mt: 1 }}>
          {[
            { text: "Settings", icon: <SettingsIcon /> },
            { text: "Messages", icon: <MailIcon /> }
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => setActiveItem(item.text)} sx={mainItemStyles(activeItem === item.text)}>
                <Box className="main-indicator" />
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;