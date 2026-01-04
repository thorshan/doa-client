import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const SelectOption = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Handle Back
  const handleBack = () => {
    navigate(-1);
  };

  // Handle Routes
  const handleMoji = () => {
    navigate("/app/moji-goi/moji");
  };
  const handleGoi = () => {
    navigate("/app/moji-goi/goi");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          width: "100%",
          maxWidth: 500,
          border: 1,
          borderColor: "primary.main",
          borderRadius: 5,
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {translations[language].choose}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              color: "text.primary",
              border: 1,
              borderColor: "primary.main",
              borderRadius: 5,
              width: 100,
              height: 50,
              backgroundColor: "background.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
                transform: "scale(1.05)",
                transition: "0.3s",
              },
            }}
            component={"button"}
            onClick={handleMoji}
          >
            {translations[language].moji}
          </Box>
          <Box
            sx={{
              color: "text.primary",
              border: 1,
              borderColor: "primary.main",
              borderRadius: 5,
              width: 100,
              height: 50,
              backgroundColor: "background.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
                transform: "scale(1.05)",
                transition: "0.3s",
              },
            }}
            component={"button"}
            onClick={handleGoi}
          >
            {translations[language].goi}
          </Box>
        </Box>

        <Button
          onClick={handleBack}
          variant="contained"
          sx={{ mt: 3, borderRadius: 5 }}
        >
          {translations[language].go_back}
        </Button>
      </Box>
    </Box>
  );
};

export default SelectOption;
