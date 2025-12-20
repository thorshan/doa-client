import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../constants/translations";

const Register = () => {
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const autoGenerateUsername = Math.random().toString(2, 12).substring(2, 12);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register({
        ...formData,
        username: autoGenerateUsername,
      });
      navigate("/");
    } catch (err) {
      console.error("Error registering user", err.message);
      setError(err.response?.data?.message || err.message);
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
        backgroundColor: "background.default",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 400,
          p: 4,
          width: "calc(100% - 32px)",
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography
            color="primary"
            component="h1"
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {translations[language].register}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              label={translations[language].name}
              autoFocus
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              type="email"
              label={translations[language].email}
              autoFocus
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              type="password"
              label={translations[language].password}
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button
              type="submit"
              fullWidth
              color="primary"
              variant="contained"
              size="small"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading
                ? translations[language].processing
                : translations[language].register}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
