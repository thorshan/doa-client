import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Backdrop, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Backdrop
        open={loading}
        sx={{
          color: "primary.loading",
          backgroundColor: "background.default",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ previous: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
