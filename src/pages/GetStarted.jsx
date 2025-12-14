import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const sampleText = "今日は天気がいいですね。散歩に行きましょう！";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(sampleText.slice(0, index + 1));
      index++;
      if (index === sampleText.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={5}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* === Text Content === */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              fontWeight="700"
              gutterBottom
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
            >
              Master Japanese Reading
            </Typography>

            <Typography variant="body1" mb={3}>
              Dive into engaging Japanese content and improve your reading and
              speaking skills. Enjoy stories and articles designed for learners
              of all levels.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/get-started")}
              sx={{
                px: 4,
                py: 1.2,
                textTransform: "capitalize",
                fontSize: "1rem",
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* === Hero Image + Animated Japanese Content with Reading === */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: 3, mb: 2, minHeight: "100px" }}
            >
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                {displayedText}
              </Typography>
            </Paper>

            <img
              src="https://images.unsplash.com/photo-1568051243851-9d8de9f4d5f4"
              alt="Japanese Learning Hero"
              style={{ width: "100%", maxWidth: "450px", borderRadius: "12px" }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default GetStarted;
