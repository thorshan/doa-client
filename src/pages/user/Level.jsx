import { Box, Button, Typography, Stack } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LEVEL } from "../../constants/level";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const Level = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const fromPath = location.state?.from || "/";

  const handleBack = () => {
    navigate("/app");
  };

  const handleSelectLevel = async (level) => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const res = await userApi.updateUserLevel(user._id, { level });
      updateUser(res.data.user);

      navigate(fromPath, { replace: true });
    } catch (error) {
      console.error("Failed to update level:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Choose Level
        </Typography>

        {/* Levels */}
        <Stack spacing={2} sx={{ mt: 3 }}>
          {Object.values(LEVEL).map((level) => (
            <Button
              key={level}
              variant="outlined"
              size="large"
              disabled={loading}
              onClick={() => handleSelectLevel(level)}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              {level}
            </Button>
          ))}
        </Stack>

        {/* Back */}
        <Button onClick={handleBack} sx={{ mt: 4 }} color="inherit">
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default Level;
