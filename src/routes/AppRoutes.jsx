import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Settings from "../pages/utils/Settings";
import Search from "../pages/utils/Search";
import Archive from "../pages/utils/Archive";
import Card from "../pages/admin/Card";
import CardDetails from "../pages/user/CardDetails";
import Profile from "../pages/user/Profile";
import GetStarted from "../pages/GetStarted";
import EditProfile from "../pages/user/EditProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={<Settings />} />
      {/* Public Routes */}

      {/* Auth Routes */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route    
        path="/user/archives"
        element={
          <ProtectedRoute>
            <Archive />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/cards/:id"
        element={
          <ProtectedRoute>
            <CardDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:id/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:id/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      {/* Auth Routes */}

      {/* Admin Routes */}
      <Route
        path="/admin/cards"
        element={
          <ProtectedRoute>
            <Card />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}

      {/* Error Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      {/* Error Routes */}
    </Routes>
  );
};

export default AppRoutes;
