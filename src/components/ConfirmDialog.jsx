import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import { translations } from "../constants/translations";
import { useLanguage } from "../context/LanguageContext";

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  const { language } = useLanguage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={Paper}
      PaperProps={{
        sx: {
          p: 3,
          width: 400,
          textAlign: "center",
          borderRadius: 5, 
        },
      }}
      BackdropProps={{
        sx: { backgroundColor: "rgba(0,0,0,0.5)" },
      }}
    >
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {translations[language].caution}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {translations[language].confirm_logout}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={onClose}
            sx={{ mr: 2, borderRadius: 5 }}
          >
            {translations[language].cancel}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onConfirm}
            sx={{ borderRadius: 5 }}
          >
            {translations[language].logout}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
