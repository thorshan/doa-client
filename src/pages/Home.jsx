import { Box, Card, CardActionArea, Typography, useTheme } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { translations } from "../constants/translations";
import { useLanguage } from "../context/LanguageContext";
import NavbarComponent from "../components/NavbarComponent";
import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import { LockRounded } from "@mui/icons-material";

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
  const [userData, setUser] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.getUserData(user?._id);
        setUser(res.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUser();
  }, [user]);

  const handleRoutes = (path) => {
    navigate(path);
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
                  ? userData?.name.split(" ")[0] + " さん"
                  : userData?.name}
              </Typography>
              <Typography variant="subtitle1">
                {lang === "jp" ? (
                  <>天気がいいから、勉強しましょう。</>
                ) : lang === "mm" ? (
                  <>ရာသီဥတုသာယာတယ်၊ စာလေ့လာကြမလား?</>
                ) : (
                  <>A Beautiful Day, Isn't it? Let's learn!</>
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
                  ? userData?.name.split(" ")[0] + " さん"
                  : userData?.name}
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

          {/* Cards Container */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 3,
              px: 3,
              mt: 3,
            }}
          >
            {cards.map((card, index) => {
              const isUnlocked =
                (userData?.level?.passed?.length ?? 0) === 0
                  ? index === 0
                  : true;

              return (
                <Card
                  key={card.char}
                  elevation={6}
                  sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    position: "relative",
                    opacity: isUnlocked ? 1 : 0.4,
                    pointerEvents: isUnlocked ? "auto" : "none",
                    transition: "0.3s",
                    "&:hover": isUnlocked
                      ? {
                          transform: "translateY(-6px)",
                          boxShadow: theme.shadows[12],
                        }
                      : {},
                  }}
                >
                  <CardActionArea
                    onClick={() => isUnlocked && handleRoutes(card.path)}
                    sx={{
                      height: 180,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      position: "relative",
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

                  {/* Lock overlay if not unlocked */}
                  {!isUnlocked && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.2)",
                        zIndex: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LockRounded fontSize="large" color="primary" />
                    </Box>
                  )}
                </Card>
              );
            })}
          </Box>
        </>
      )}
      <Outlet />
    </Box>
  );
};

export default Home;
