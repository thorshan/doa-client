import { Box } from "@mui/material";
import BasicInfo from "./BasicInfo";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

const Basic = () => {
  const { user } = useAuth();
  const location = useLocation();
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
  const isBasePath = location.pathname === "/app/basic";

  if (isBasePath) {
    return <BasicInfo />;
  }

  return <Outlet />;
};

export default Basic;
