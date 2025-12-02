import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ColorModeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ColorModeProvider>
          <AppRoutes />
        </ColorModeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
