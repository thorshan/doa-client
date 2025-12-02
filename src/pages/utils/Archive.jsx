import { Box, Stack, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const Archive = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <Box sx={{ p: { sm: 3, xs: 2 } }}>
      <Stack direction={"row"} spacing={{ sm: 3, xs: 2 }}>
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={<ArrowBack />}
          sx={{ textTransform: "none" }}
          onClick={handleBack}
        ></Button>
        <Typography
          variant="h6"
          fontWeight={{ sm: "bold" }}
          color="text.primary"
          sx={{ mt: 3 }}
        >
          {translations[language].archive}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Archive;
