import React, { useEffect, useState } from "react";
import {
  Box,
  CardMedia,
  Button,
  Stack,
  useTheme,
  Typography,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  useMediaQuery,
  Zoom,
  Fab,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Brightness4,
  Brightness7,
  KeyboardArrowUpRounded,
  FacebookOutlined,
  Instagram,
  Telegram,
} from "@mui/icons-material";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../constants/translations";
import { useColorMode } from "../context/ThemeContext";
import LanguageToggler from "../components/LangToggler";
import LanguageTogglerS from "../components/MobileLangToggler";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { userApi } from "../api/userApi";
import { ROLES } from "../constants/roles";

const GetStarted = () => {
  const { isAuthenticated, user } = useAuth();
  const { toggleColorMode } = useColorMode();
  const { language } = useLanguage();
  const theme = useTheme();
  const [showBtn, setShowBtn] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const lang = localStorage.getItem("lang");
  const currentTheme = localStorage.getItem("themeMode");
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await userApi.getUserData(user?._id);
      setCurrentUser(res.data);
    };

    fetchCurrentUser();
  }, [user?._id]);

  const navLinks = [
    { name: translations[language].manual, id: "manual" },
    { name: translations[language].about, id: "about" },
    { name: translations[language].apps, id: "apps" },
  ];

  const apps = [
    { name: "IOS", path: "/#", image: "/assets/ios.png" },
    { name: "Andriod", path: "/#", image: "/assets/android.png" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const skills = [
    translations[language].s_speaking,
    translations[language].s_reading,
    translations[language].s_listening,
    translations[language].s_vocab,
    translations[language].s_grammar,
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % skills.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBtn(window.pageYOffset > 300);
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setIsScrolled(scrollTop > 50);
      setScrollProgress((scrollTop / docHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log(user?.role);

  return (
    <Box>
      {/* 
          NAVBAR
      */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1200,
          transition: "all 0.3s ease",
          backgroundColor: isScrolled ? "background.paper" : "transparent",
          backdropFilter: isScrolled ? "blur(8px)" : "none",
        }}
      >
        {/* Scroll Progress */}
        <LinearProgress
          variant="determinate"
          value={scrollProgress}
          sx={{
            height: 3,
            backgroundColor: "transparent",
            "& .MuiLinearProgress-bar": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />

        <Box
          sx={{
            height: 90,
            px: isMobile ? 2 : 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "transparent",
          }}
        >
          {/* Logo */}
          <CardMedia
            component="img"
            src="/assets/logo.svg"
            alt="Logo"
            sx={{ height: 50, width: 50, objectFit: "contain" }}
          />

          {/* Desktop Nav */}
          {!isMobile && (
            <Stack direction="row" spacing={2}>
              {navLinks.map((nav, index) => (
                <Button
                  key={index}
                  onClick={() => handleScrollTo(nav.id)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  {nav.name}
                </Button>
              ))}
              <IconButton onClick={toggleColorMode} color="primary">
                {theme.palette.mode === "dark" ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </IconButton>
              <LanguageToggler />
              {user?.role === ROLES.ADMIN && (
                <Button href="/admin">
                  {translations[language].dashboard || "Console"}
                </Button>
              )}

              {/* {!isAuthenticated ? (
                <>
                  <Button href="/register">
                    {translations[language].register}
                  </Button>
                  <Button variant="contained" href="/login">
                    {translations[language].login}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  href={
                    isAuthenticated
                      ? currentUser?.level?.passed?.length > 0
                        ? "/app"
                        : "/options"
                      : "/register"
                  }
                >
                  {translations[language].get_started}
                </Button>
              )} */}
            </Stack>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Spacer for fixed navbar */}
      <Box sx={{ height: 90 }} />

      {/* 
          MOBILE DRAWER
      */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack spacing={2} mt={2}>
            {navLinks.map((nav, index) => (
              <Button
                key={index}
                onClick={() => {
                  setDrawerOpen(false);
                  handleScrollTo(nav.id);
                }}
              >
                {nav.name}
              </Button>
            ))}
            <Button onClick={toggleColorMode} color="primary">
              {theme.palette.mode === "dark" ? (
                <Brightness7 />
              ) : (
                <Brightness4 />
              )}
            </Button>
            <LanguageTogglerS />
            {user?.role === ROLES.ADMIN && (
              <Button href="/admin">
                {translations[language].dashboard || "Console"}
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>

      {/*  */}
      <Zoom in={showBtn}>
        <Fab
          color="primary"
          aria-label="back to top"
          onClick={handleClick}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpRounded />
        </Fab>
      </Zoom>
      {/*  */}

      {/*HERO SECTION
       */}
      <Box
        sx={{
          height: "90vh",
          px: isMobile ? 2 : 10,
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        {lang === "jp" ? (
          <Box sx={{ zIndex: 1 }}>
            <Typography
              variant="h3"
              fontSize={isMobile && 24}
              fontWeight="bold"
              color="text.primary"
            >
              「ドア」で日本語の
            </Typography>

            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
              fontSize={isMobile && 60}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "flex-start", sm: "center" },
                alignItems: { sm: "center", xs: "start" },
                mt: 2,
              }}
            >
              <Box
                key={skills[index]}
                component="span"
                sx={{
                  animation: "fadeSlide 0.6s ease",
                  mr: 3,
                  mb: { sm: 0, xs: 3 },
                }}
              >
                {skills[index]}
              </Box>
              <Typography
                variant="h4"
                fontSize={isMobile && 24}
                fontWeight="bold"
                color="text.primary"
                sx={{ mt: 2 }}
              >
                を向上させましょう
              </Typography>
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              // href={
              //   isAuthenticated
              //     ? currentUser?.level.passed.length > 0
              //       ? "/app"
              //       : "/options"
              //     : "/register"
              // }
            >
              ドアヘようこそう
            </Button>
          </Box>
        ) : lang === "mm" ? (
          <Box sx={{ zIndex: 1 }}>
            <Typography
              variant="h3"
              fontSize={isMobile && 24}
              fontWeight="bold"
            >
              ドア နဲ့အတူ သင်၏ ဂျပန်စာ
            </Typography>

            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
              fontSize={isMobile && 60}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "flex-start", sm: "center" },
                alignItems: { sm: "center", xs: "start" },
                mt: 2,
              }}
            >
              <Box
                key={skills[index]}
                component="span"
                sx={{
                  animation: "fadeSlide 0.6s ease",
                  mr: 3,
                  mb: { sm: 0, xs: 3 },
                }}
              >
                {skills[index]}
              </Box>
              <Typography
                variant="h4"
                fontSize={isMobile && 24}
                fontWeight="bold"
                color="text.primary"
                sx={{ mt: 2 }}
              >
                စွမ်းရည်ကို အဆင့်မြှင့်တင်ပါ
              </Typography>
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              // href={
              //   isAuthenticated
              //     ? currentUser?.level?.passed?.length > 0
              //       ? "/app"
              //       : "/options"
              //     : "/register"
              // }
            >
              စတင်ကြိုးစားမယ်
            </Button>
          </Box>
        ) : (
          <Box sx={{ zIndex: 1 }}>
            <Typography
              variant="h3"
              fontSize={isMobile && 24}
              fontWeight="bold"
            >
              Upgrade your Japanese
            </Typography>

            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
              fontSize={isMobile && 60}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "flex-start", sm: "center" },
                alignItems: { sm: "center", xs: "start" },
                mt: 2,
              }}
            >
              <Box
                key={skills[index]}
                component="span"
                sx={{
                  animation: "fadeSlide 0.6s ease",
                  mr: 3,
                  mb: { sm: 0, xs: 3 },
                }}
              >
                {skills[index]}
              </Box>
              <Typography
                variant="h3"
                fontSize={isMobile && 24}
                fontWeight="bold"
                color="text.primary"
                sx={{ mt: 2 }}
              >
                skill with ドア
              </Typography>
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              // href={
              //   isAuthenticated
              //     ? currentUser?.level.passed.length > 0
              //       ? "/app"
              //       : "/options"
              //     : "/register"
              // }
            >
              Get Started
            </Button>
          </Box>
        )}

        {/* Hero Image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 950,
            height: "100%",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          {currentTheme === "dark" ? (
            <CardMedia
              component="img"
              src="/assets/world-d.svg"
              alt="World"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: { xs: 0.15, sm: 0.4 },
              }}
            />
          ) : (
            <CardMedia
              component="img"
              src="/assets/world-d.svg"
              alt="World"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: { xs: 0.15, sm: 0.4 },
              }}
            />
          )}
        </Box>

        <style>
          {`
            @keyframes fadeSlide {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </Box>

      {/* 
          MANUAL SECTION
       */}
      <Box
        id="manual"
        sx={{ scrollMarginTop: "90px", height: "100vh", px: isMobile ? 2 : 10 }}
      >
        <Divider>
          <Typography variant="h5" color="primary">
            {translations[language].manual}
          </Typography>
        </Divider>
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {translations[language].user_manual}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: "text.secondary", maxWidth: 600, mx: "auto" }}
            >
              {lang === "jp" ? (
                <>
                  「ドア」を最大限に活用する方法を学びましょう！ヒント、コツ、ステップバイステップのガイダンスを学び、読む、書く、話す、聞くという日本語のスキルを向上させましょう。
                </>
              ) : lang === "mm" ? (
                <>
                  ドア ကို အကောင်းဆုံးအသုံးချနည်းကို ရှာဖွေတွေ့ရှိလိုက်ပါ။
                  စာဖတ်ခြင်း၊ ရေးသားခြင်း၊ ပြောဆိုခြင်းနှင့်
                  နားထောင်ခြင်းဆိုင်ရာ သင်၏ ဂျပန်ဘာသာစကားစွမ်းရည်ကို
                  တိုးတက်စေရန် အကြံပြုချက်များ၊ လှည့်ကွက်များနှင့်
                  အဆင့်ဆင့်လမ်းညွှန်ချက်များကို လေ့လာလိုက်ပါ။
                </>
              ) : (
                <>
                  Discover how to make the most out of ドア! Learn tips, tricks,
                  and step-by-step guidance to improve your Japanese skills in
                  Reading, Writing, Speaking, and Listening.
                </>
              )}
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 3 }}>
              {translations[language].explore}
            </Button>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 550,
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              src="/assets/manual.svg"
              alt="World"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: { xs: 0.15, sm: 0.4 },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* 
          ABOUT SECTION
       */}
      <Box
        id="about"
        sx={{ scrollMarginTop: "90px", height: "100vh", px: isMobile ? 2 : 10 }}
      >
        <Divider>
          <Typography variant="h5" color="primary">
            {translations[language].about}
          </Typography>
        </Divider>
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {translations[language].about_team}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: "text.secondary", maxWidth: 600, mx: "auto" }}
            >
              {lang === "jp" ? (
                <>
                  「ドア」は、学習者が効率的に日本語を習得できるよう支援することに専念しています。言語の専門家と教育者からなる当社のチームは、あらゆるレベルの読解、ライティング、スピーキング、リスニングのスキルを向上させるためのインタラクティブなレッスンとエクササイズを設計しています。
                </>
              ) : lang === "mm" ? (
                <>
                  ドア သည် သင်ယူသူများ ဂျပန်စာကို ထိရောက်စွာ ကျွမ်းကျင်အောင်
                  ကူညီပေးရန် ရည်ရွယ်ပါသည်။ ကျွန်ုပ်တို့၏
                  ဘာသာစကားကျွမ်းကျင်သူများနှင့် ပညာရေးပညာရှင်များအဖွဲ့သည်
                  အဆင့်အားလုံးအတွက် စာဖတ်ခြင်း၊ ရေးသားခြင်း၊ ပြောဆိုခြင်းနှင့်
                  နားထောင်ခြင်းစွမ်းရည်များကို မြှင့်တင်ရန်အတွက်
                  အပြန်အလှန်အကျိုးသက်ရောက်သော သင်ခန်းစာများနှင့်
                  လေ့ကျင့်ခန်းများကို ဒီဇိုင်းထုတ်ထားပါသည်။
                </>
              ) : (
                <>
                  ドア is dedicated to helping learners master Japanese
                  efficiently. Our team of language experts and educators has
                  designed interactive lessons and exercises to enhance Reading,
                  Writing, Speaking, and Listening skills for all levels.
                </>
              )}
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 3 }}>
              {translations[language].explore}
            </Button>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 550,
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              src="/assets/about.svg"
              alt="World"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: { xs: 0.15, sm: 0.4 },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Apps Section */}
      <Box
        id="apps"
        sx={{ scrollMarginTop: "90px", height: "100vh", px: isMobile ? 2 : 10 }}
      >
        <Divider>
          <Typography variant="h5" color="primary">
            {translations[language].apps}
          </Typography>
        </Divider>
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {translations[language].use_app}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: "text.secondary", maxWidth: 600 }}
            >
              {lang === "jp" ? (
                <>
                  「ドア」はアプリ版もご用意しております。各アプリストアから簡単にインストールできます。ぜひ当社の強力なアプリをお楽しみください！
                </>
              ) : lang === "mm" ? (
                <>
                  ドア ကို အက်ပ်ဗားရှင်းအတွက်လည်း ရရှိနိုင်ပါသည်။ သက်ဆိုင်ရာ
                  အက်ပ်စတိုးများမှ ရိုးရိုးရှင်းရှင်း ထည့်သွင်းနိုင်ပါသည်။ သင်၏
                  ခိုင်မာသော အက်ပ်ကို ပျော်ရွှင်စွာ အသုံးပြုလိုက်ပါ။
                </>
              ) : (
                <>
                  ドア is also available for app version. You can simply install
                  from the realtive app stores. Enjoy our roubust app!
                </>
              )}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mt: 3,
              }}
            >
              {apps.map((app, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 120,
                    height: 50,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: alpha(theme.palette.text.primary, 0.1),
                    border: 1,
                    borderColor: "primary.main",
                    borderRadius: 20,
                    overflow: "hidden",
                    textDecoration: "none",
                  }}
                  component={Link}
                  to={app.path}
                >
                  <Typography
                    variant="caption"
                    color="text.primary"
                    fontWeight={"bold"}
                    sx={{
                      zIndex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      ml: 3,
                    }}
                  >
                    {app.name}
                  </Typography>
                  <CardMedia
                    component="img"
                    src={app.image}
                    alt="World"
                    sx={{
                      width: 49,
                      mt: 2.5,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 550,
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              src="/assets/apps.svg"
              alt="World"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: { xs: 0.15, sm: 0.4 },
              }}
            />
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={3} direction={"row"}>
          <IconButton href="/#">
            <FacebookOutlined />
          </IconButton>
          <IconButton href="/#">
            <Instagram />
          </IconButton>
          <IconButton href="/#">
            <Telegram />
          </IconButton>
        </Stack>
        <Typography variant="body2" sx={{ my: 2 }}>
          {lang === "jp" ? (
            <>「ドア」であなたの日本語を向上させましょう</>
          ) : lang === "mm" ? (
            <>ドア နဲ့အတူ သင်၏ ဂျပန်စာစွမ်းရည်ကို အဆင့်မြှင့်တင်ပါ</>
          ) : (
            <>Upgrade your Japanese Language Skills with ドア</>
          )}
        </Typography>
        <Typography variant="caption" sx={{ mb: 3 }}>
          Copyright &copy; {new Date().getFullYear()} - doa.com
        </Typography>
      </Box>
    </Box>
  );
};

export default GetStarted;
