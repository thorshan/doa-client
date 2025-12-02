import { Box, Button, Dialog, Paper, Typography } from "@mui/material";
import { translations } from "../constants/translations";
import { useLanguage } from "../context/LanguageContext";
const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  const { language } = useLanguage();

  return (
    <Dialog
      open={open}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        zIndex: 1500,
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {translations[language].caution}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {translations[language].confirm_logout}
        </Typography>
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            {translations[language].cancel}
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            {translations[language].logout}
          </Button>
        </Box>
      </Paper>
    </Dialog>
  );
};

export default ConfirmDialog;
