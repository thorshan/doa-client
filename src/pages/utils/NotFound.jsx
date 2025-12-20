import { Box, Button, CardMedia, Typography } from "@mui/material";
import React from "react";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const NotFound = () => {
  const { language } = useLanguage();
  return (
    <Box>
      <Box
        sx={{
          height: "90vh",
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {/* Text */}
        <Box sx={{ zIndex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {translations[language].not_found}
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
            {translations[language]._404sub}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 2, color: "text.secondary", maxWidth: 600 }}
          >
            {translations[language]._404txt}
          </Typography>

          <Button variant="contained" sx={{ mt: 3 }} href="/app">
            {translations[language].go_back}
          </Button>
        </Box>

        {/* Image */}
        <Box
          sx={{
            width: 600,
            height: "100%",
            display: { xs: "none", md: "block" },
          }}
        >
          <CardMedia
            component="img"
            src="/assets/not-found.svg"
            alt="World"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: 0.4,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
