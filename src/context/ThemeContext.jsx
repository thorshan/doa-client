import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create context
const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

const getInitialMode = () => {
  const savedMode = localStorage.getItem("themeMode");
  if (savedMode) {
    return savedMode;
  }

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  return "light";
};

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (event) => {
      setMode(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("themeMode", mode);
    }
  }, [mode]);

  // Toggle between light/dark
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Define theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // 'light' or 'dark'

          primary:
            mode === "light"
              ? {
                  main: "#047e4bff",
                  loading: "#081d2a",
                  border: "#081d2a",
                  footer: "#efefef",
                }
              : {
                  main: "#009959ff",
                  loading: "#efefef",
                  border: "#efefef",
                  footer: "#081d2a",
                },
          secondary:
            mode === "light"
              ? {
                  main: "#16c47f",
                }
              : {
                  main: "#7ed4ad",
                },
          background:
            mode === "light"
              ? {
                  default: "#efefef",
                  paper: "#efefef",
                }
              : {
                  default: "#081d2a",
                  paper: "#081d2a",
                },

          text:
            mode === "light"
              ? {
                  primary: "#081d2a",
                }
              : {
                  primary: "#efefef",
                },
        },
        typography: {
          fontFamily:
            '"Noto Sans Myanmar","Noto Sans JP", "Roboto", "Arial", sans-serif',
          h1: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          h2: {
            fontFamily:
              '""Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          h3: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          h4: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          h5: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          h6: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          button: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          body1: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          body2: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          subtitle1: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          subtitle2: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
          caption: {
            fontFamily:
              '"Noto Sans Myanmar","Noto Sans JP", "Roboto", sans-serif',
            textTransform: "none",
          },
        },
        components: {
          MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
          MuiTab: { styleOverrides: { root: { textTransform: "none" } } },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
