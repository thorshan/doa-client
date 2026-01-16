import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar, Box, CardMedia, IconButton } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { userApi } from "../api/userApi";

const NavbarComponent = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await userApi.getUserData(user?.id);
        setCurrentUser(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, [user?.id]);

  return (
    <Box
      sx={{
        height: 90,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        src="/assets/logo.svg"
        alt="Logo"
        sx={{ height: 50, width: 50, objectFit: "contain" }}
      />
      <IconButton component={Link} to="/app/settings">
        <Avatar
          src={
            currentUser?.image
              ? `${import.meta.env.VITE_API}${currentUser.image.filePath}`
              : undefined
          }
        >
          {!currentUser?.image && currentUser?.name?.[0]}
        </Avatar>
      </IconButton>
    </Box>
  );
};

export default NavbarComponent;
