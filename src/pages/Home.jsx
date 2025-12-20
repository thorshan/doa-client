import { Box, Card, CardActionArea, Typography, useTheme } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { translations } from "../constants/translations";
import { useLanguage } from "../context/LanguageContext";
import NavbarComponent from "../components/NavbarComponent";

const Home = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const lang = localStorage.getItem("lang");
  const now = new Date();
  const hours = now.getHours();
  const checkTime = hours >= 12 ? "PM" : "AM";
  const isHomeIndex = location.pathname === "/app";

  const handleRoutes = (path) => {
    if (!user?.level) {
      navigate("/app/level", { state: { from: location.pathname } });
    } else {
      navigate(path);
    }
  };

  const cards = [
    {
      title: translations[language].basic_japanese,
      char: translations[language].basic_japanese,
      path: "/app/basic",
    },
    {
      title: translations[language].moji_goi,
      char: translations[language].moji_goi,
      path: "/app/moji-goi/options",
    },
    {
      title: translations[language].s_grammar,
      char: translations[language].s_grammar,
      path: "/app/grammar",
    },
    {
      title: translations[language].s_reading,
      char: translations[language].s_reading,
      path: "/app/reading",
    },
    {
      title: translations[language].s_listening,
      char: translations[language].s_listening,
      path: "/app/listening",
    },
    {
      title: translations[language].s_speaking,
      char: translations[language].s_speaking,
      path: "/app/speaking",
    },
    {
      title: translations[language].exams,
      char: translations[language].exams,
      path: "/app/exams",
    },
  ];

  return (
    <Box>
      {isHomeIndex && (
        <>
          <NavbarComponent />
          {/* Greetings */}
          {checkTime === "AM" ? (
            <Box
              sx={{
                px: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Typography variant="h6">
                {lang === "jp" ? (
                  <>おはようございます、</>
                ) : lang === "mm" ? (
                  <>မင်္ဂလာနံနက်ခင်းပါ၊</>
                ) : (
                  <>Good Morning,</>
                )}
              </Typography>
              <Typography variant="h4" fontWeight={"bold"}>
                {lang === "jp"
                  ? user?.name.split(" ")[0] + " さん"
                  : user?.name}
              </Typography>
              <Typography variant="subtitle1">
                {lang === "jp" ? (
                  <>天気がいいから、勉強しましょう。</>
                ) : lang === "mm" ? (
                  <>ရာသီဥတုသာယာတယ်၊ စာလေ့လာကြမလား?</>
                ) : (
                  <>A Beautiful Day, Isn't? Let's learn!</>
                )}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                px: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Typography variant="h6">
                {lang === "jp" ? (
                  <>こんにちは、</>
                ) : lang === "mm" ? (
                  <>မင်္ဂလာညနေခင်းပါ၊</>
                ) : (
                  <>Good Afternoon,</>
                )}
              </Typography>
              <Typography variant="h4" fontWeight={"bold"}>
                {lang === "jp"
                  ? user?.name.split(" ")[0] + " さん"
                  : user?.name}
              </Typography>
              <Typography variant="subtitle1">
                {lang === "jp" ? (
                  <>お疲れ様です、勉強続けましょうか?</>
                ) : lang === "mm" ? (
                  <>ပင်ပန်းသွားပြီဆိုပေမယ့်၊ ဆက်လေ့လာကြမလား?</>
                ) : (
                  <>Shall we continue studying!</>
                )}
              </Typography>
            </Box>
          )}

          {/* Continue Learning Card */}
          <Box sx={{ px: 3 }}>
            <Box sx={{ my: 3 }}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 5,
                }}
                elevation={6}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {" "}
                    Continue Learning{" "}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {" "}
                    Progress{" "}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "grey.300",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: "60%",
                        height: "100%",
                        backgroundColor: "primary.main",
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>

          {/* Cards Container */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 3,
              px: 3,
            }}
          >
            {cards.map((card) => (
              <Card
                key={card.char}
                elevation={6}
                sx={{
                  borderRadius: 5,
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: theme.palette.background.paper,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleRoutes(card.path)}
                  sx={{
                    height: 180,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    textAlign: "center",
                    p: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* Background character */}
                  <Typography
                    variant="h1"
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      transform: "translateX(-30%)",
                      fontSize: "15rem",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      opacity: 0.1,
                      pointerEvents: "none",
                      userSelect: "none",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      mt: 3,
                    }}
                  >
                    {card.char}
                  </Typography>

                  {/* Card title */}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    {card.title}
                  </Typography>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </>
      )}
      <Outlet />
    </Box>
  );
};

export default Home;
