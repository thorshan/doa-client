import { Alert } from "@mui/material";
import { useState } from "react";

const AlertModal = ({ type, message }) => {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <Alert
      severity={type}
      onClose={() => setOpen(false)}
      sx={{
        position: "fixed",
        top: 50,
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1300,
        minWidth: "80%",
        borderRadius: 2,
      }}
    >
      {message}
    </Alert>
  );
};
export default AlertModal;
