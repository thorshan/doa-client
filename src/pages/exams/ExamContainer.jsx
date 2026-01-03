import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingComponent from "../../components/LoadingComponent";
import { Outlet } from "react-router-dom";

const ExamContainer = () => {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;

    const delay = Math.random() * 2000 + 1000;
    const timer = setTimeout(() => {
      setReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [user]);

  if (!ready) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingComponent />
      </Box>
    );
  }
  return <Outlet />;
};

export default ExamContainer;
