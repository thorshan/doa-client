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
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const Login = () => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const prevURL = location.state?.previous || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({
        email,
        password,
      });
      navigate(prevURL, {replace: true});
    } catch (err) {
      console.error("Error login", err.message);
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
            {translations[language].login}
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
              type="email"
              label={translations[language].email}
              autoFocus
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              label={translations[language].password}
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                : translations[language].login}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
