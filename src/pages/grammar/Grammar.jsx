import { Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import getGrammarComponent from "../../components/GrammarComponent";

// Import all grammar components
import N1Grammar from "./N1Grammar";
import N2Grammar from "./N2Grammar";
import N3Grammar from "./N3Grammar";
import N4Grammar from "./N4Grammar";
import N5Grammar from "./N5Grammar";

const Grammar = () => {
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

  // Map user level to component
  const levelMap = {
    N1: N1Grammar,
    N2: N2Grammar,
    N3: N3Grammar,
    N4: N4Grammar,
    N5: N5Grammar,
  };

  const isBasePath = location.pathname === "/app/grammar";

  if (user?.level && isBasePath) {
    const LevelComponent = getGrammarComponent(user.level, levelMap, N5Grammar);
    return <LevelComponent />;
  }

  // For child routes like /app/grammar/n5 or /courses/:id/lectures/:id
  return <Outlet />;
};

export default Grammar;
