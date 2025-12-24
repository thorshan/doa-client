import {
  alpha,
  Box,
  Button,
  Typography,
  useTheme,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import NavbarComponent from "../../components/NavbarComponent";
import BreadCrumbs from "../../components/BreadCrumbs";
import {
  ArticleRounded,
  ClassRounded,
  HomeRounded,
  TrendingFlatRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { GET_STARTED } from "../../constants/basic";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const BasicDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lecture = location.state?.lecture;
  const name = location.state?.name;
  const path = location.state?.path;
  const theme = useTheme();
  const { language } = useLanguage();

  // Flatten all lectures for navigation
  const allLectures = GET_STARTED.flatMap((section) => section.description);

  const currentIndex = allLectures.findIndex((l) => l._id === lecture._id);
  const prevLecture = allLectures[currentIndex - 1] || null;
  const nextLecture = allLectures[currentIndex + 1] || null;

  // Speech function
  const kanaSoundMap = { は: "はっ", へ: "へっ", た: "たっ", ん: "んー" };
  const speakJP = (char) => {
    const text = kanaSoundMap[char] || char;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleNavigate = (lec) => {
    navigate(`/app/basic/lectures/${lec._id}`, {
      state: { lecture: lec, name: name, path: path },
    });
  };

  return (
    <Box>
      <NavbarComponent />
      <Box px={3}>
        <BreadCrumbs
          items={[
            {
              icon: (
                <HomeRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: "/app",
              name: translations[language].home,
            },
            {
              icon: (
                <ClassRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: `${path}`,
              name: name,
            },
            {
              icon: (
                <ArticleRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: window.location.href,
              name: lecture.title,
            },
          ]}
        />
      </Box>

      {/* Content */}
      <Box sx={{ px: 3 }}>
        <Typography variant="h6" sx={{ my: 3 }}>
          {lecture.title}
        </Typography>
        <Box
          sx={{
            p: 3,
            border: 1,
            borderRadius: 5,
            borderColor: "primary.main",
            my: 3,
          }}
        >
          {lecture.content?.map((cont) => (
            <Box key={cont._id} sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
                >
                  {cont.title}
                </Typography>
                <Button
                  sx={{
                    borderRadius: 5,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  {cont.tag}
                </Button>
              </Box>
              <Typography
                sx={{
                  borderRadius: 5,
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                  py: 1,
                  px: 2,
                  whiteSpace: "pre-line",
                }}
              >
                {cont.description}
              </Typography>
            </Box>
          ))}
          {lecture?.table?.rows?.map((row) => (
            <Box
              key={row._id}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 1,
                mb: 2,
              }}
            >
              {row.hira.map((char, idx) => (
                <Box
                  key={idx}
                  onClick={() => char && speakJP(char)}
                  sx={{
                    minHeight: 72,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    cursor: char ? "pointer" : "default",
                    backgroundColor: char ? "background.paper" : "transparent",
                    "&:hover": char && { backgroundColor: "action.hover" },
                  }}
                >
                  <Typography
                    fontWeight={400}
                    sx={{ fontSize: {xs: "1rem", sm: "1.7rem"} }}
                  >
                    {char || ""}
                  </Typography>

                  {row.romaji[idx] && (
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {row.romaji[idx]}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        {lecture?.table?.example && (
          <>
            <Divider>
              <Chip label={translations[language].example} size="small" />
            </Divider>

            <Box
              sx={{
                p: 3,
                border: 1,
                borderRadius: 5,
                borderColor: "primary.main",
                my: 3,
              }}
            >
              {lecture?.table?.example?.map((eg) => (
                <Box key={eg._id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      my: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {eg.hiragana}
                    </Typography>
                    <TrendingFlatRounded />
                    <Button
                      sx={{
                        borderRadius: 5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      {eg.romaji}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Prev / Next Navigation */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            disabled={!prevLecture}
            onClick={() => prevLecture && handleNavigate(prevLecture)}
          >
            {translations[language].previous}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              if (nextLecture) {
                handleNavigate(nextLecture);
              } else {
                navigate("/app/basic/exam");
              }
            }}
          >
            {nextLecture
              ? translations[language].next
              : translations[language].finish}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default BasicDetails;
