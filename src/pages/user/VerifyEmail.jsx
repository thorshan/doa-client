import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUser] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getUserData(user?._id);
        setUser(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUser();
  }, [user]);

  const requestOTP = async () => {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await userApi.sendOTP({ email: userData.email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const data = {
        email: userData.email,
        otp,
    }
    try {
      const res = await userApi.verifyOTP(data);
      setMessage(res.data.message);
      setTimeout(() => navigate("/app/settings"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Verify Your Email
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Typography mb={2}>
        Email: <b>{userData.email}</b>
      </Typography>

      <Button fullWidth variant="outlined" sx={{ mb: 2 }} onClick={requestOTP}>
        {loading ? "Sending ..." : "Send OTP"}
      </Button>

      <Box component="form" onSubmit={handleVerify}>
        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
          {loading ? "Verifying ..." : "Verify Email"}
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
