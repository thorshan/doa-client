import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useTheme,
  alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PriorityHighRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { HIRAGANA } from "../../constants/hiragana";
import { KATAKANA } from "../../constants/katakana";
import ConfettiOverlay from "../../components/ConfettiOverlay";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../constants/translations";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

/* ---------------- HELPERS ---------------- */
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const pickFive = (data) =>
  shuffleArray(Object.entries(data))
    .slice(0, 5)
    .map(([romaji, kana]) => ({ romaji, kana }));

/* ---------------- COMPONENT ---------------- */
const BasicExam = () => {
  const { user } = useAuth();
  const lang = localStorage.getItem("lang");
  const navigate = useNavigate();
  const theme = useTheme();
  const { language } = useLanguage();
  const level = "Basic";

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [finishedAll, setFinishedAll] = useState(false);

  const [mode, setMode] = useState("hiragana"); // hiragana | katakana
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [isCorrect, setIsCorrect] = useState({});

  /* ---------------- LOAD QUESTIONS ---------------- */
  const loadQuestions = (type) => {
    const picked =
      type === "hiragana" ? pickFive(HIRAGANA) : pickFive(KATAKANA);

    const init = {};
    picked.forEach((_, i) => (init[`q${i}`] = ""));

    setQuestions(picked);
    setFormData(init);
    setIsCorrect({});
  };

  useEffect(() => {
    loadQuestions("hiragana");
  }, []);

  const getReady = () => {
    setReady(true);
    setChecking(false);
  };

  /* ---------------- SUBMIT ---------------- */
  const submitForm = (e) => {
    e.preventDefault();

    const result = {};
    questions.forEach((q, i) => {
      result[`q${i}`] = formData[`q${i}`].trim().toLowerCase() === q.romaji;
    });

    setIsCorrect(result);
    setOpenDialog(true);

    const score = Object.values(result).filter(Boolean).length;
    if (score === 5) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2500);
    }
  };

  const score = Object.values(isCorrect).filter(Boolean).length;
  const finished = score === 5;

  /* ---------------- CONTINUE ---------------- */
  const handleContinue = async () => {
    setOpenDialog(false);

    if (finished && mode === "hiragana") {
      setMode("katakana");
      loadQuestions("katakana");
    } else if (finished && mode === "katakana") {
      setFinishedAll(true);
      await userApi.updateUserLevel(user._id, {level});
    }
  };

  /* ---------------- TRY AGAIN ---------------- */
  const resetExam = () => {
    if (!finishedAll) {
      loadQuestions(mode);
      setOpenDialog(false);
      setCelebrate(false);
    } else {
      // Restart full exam
      setFinishedAll(false);
      setMode("hiragana");
      loadQuestions("hiragana");
      setCelebrate(false);
    }
  };

  /* ---------------- INPUT ---------------- */
  const renderInput = (q, index) => (
    <Box
      key={index}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        my: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ whiteSpace: "nowrap" }}>
        {q.kana}
      </Typography>
      <TextField
        fullWidth
        required
        size="small"
        label={translations[language].write_romaji}
        value={formData[`q${index}`] || ""}
        onChange={(e) =>
          setFormData({ ...formData, [`q${index}`]: e.target.value })
        }
        sx={{
          ml: 3,
          "& .MuiOutlinedInput-root": { borderRadius: 5 },
        }}
      />
    </Box>
  );

  /* ---------------- READY SCREEN ---------------- */
  if (checking)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 5, maxWidth: 420 }}>
          <Stack spacing={3} alignItems="center">
            <PriorityHighRounded fontSize="large" />
            <Typography variant="h6" textAlign="center">
              {lang === "jp"
                ? "テストの準備はできていますか。"
                : lang === "mm"
                ? "စမ်းသပ်ဖို့ အဆင်သင့်ဖြစ်ပြီလား?"
                : "Are you ready to test?"}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => navigate(-1)}>
                {translations[language].go_back}
              </Button>
              <Button variant="contained" onClick={getReady}>
                {translations[language].ready}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );

  /* ---------------- FINISH SCREEN ---------------- */
  if (finishedAll)
    return (
      <Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
        <Typography variant="h4" mb={2}>
          {lang === "jp" ? (
            <>🎉 おめでとうございます!</>
          ) : lang === "mm" ? (
            <>🎉 ဂုဏ်ယူပါတယ်!</>
          ) : (
            <>🎉 Congratulations!</>
          )}
        </Typography>
        <Typography mb={3}>
          {lang === "jp" ? (
            <>ひらがなとカタカナの両方の試験に合格しました。</>
          ) : lang === "mm" ? (
            <>ဟီရဂနနှင့် ခတခန စာမေးပွဲနှစ်ခုလုံးကို သင်ဖြေဆိုပြီးပါပြီ။</>
          ) : (
            <>You completed both Hiragana and Katakana exams.</>
          )}
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="contained" onClick={resetExam}>
            {translations[language].restart_exam}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app")}>
            {translations[language].finish}
          </Button>
        </Stack>
        {celebrate && <ConfettiOverlay isActive />}
      </Box>
    );

  /* ---------------- EXAM SCREEN ---------------- */
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        {mode === "hiragana"
          ? translations[language].hiragana_exam
          : translations[language].katakana_exam}
      </Typography>

      <Box component="form" onSubmit={submitForm}>
        <Paper sx={{ p: 3, borderRadius: 5 }}>
          <Typography variant="subtitle1" mb={2}>
            {translations[language].write_hiragana}
          </Typography>

          {questions.map(renderInput)}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, borderRadius: 5 }}
          >
            {translations[language].check}
          </Button>
        </Paper>
      </Box>

      {/* ================= DIALOG ================= */}
      <Dialog open={openDialog} fullWidth maxWidth="sm">
        <DialogTitle>{translations[language].results}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", mb: 3 }}>
            <Typography variant="h6" mr={2}>
              {translations[language].score}
            </Typography>
            <Button
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 5,
              }}
            >
              {score} / 5
            </Button>
          </Box>

          {questions.map((q, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: 1,
                borderRadius: 4,
                p: 2,
                mb: 1,
                borderColor: isCorrect[`q${i}`] ? "success.main" : "error.main",
              }}
            >
              <Box>
                <Typography variant="caption">
                  {mode === "hiragana"
                    ? translations[language].hiragana
                    : translations[language].katakana}
                </Typography>
                <Typography variant="h6">{q.kana}</Typography>
              </Box>

              <Box>
                <Typography variant="caption">
                  {translations[language].correct_answer}
                </Typography>
                <Typography variant="h6">{q.romaji}</Typography>
              </Box>

              <Box>
                <Typography variant="caption">
                  {translations[language].your_answer}
                </Typography>
                <Typography variant="h6">{formData[`q${i}`] || "-"}</Typography>
              </Box>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          {!finished && (
            <Button onClick={resetExam}>
              {translations[language].try_again}
            </Button>
          )}
          <Button variant="contained" onClick={handleContinue}>
            {finished && mode === "hiragana"
              ? translations[language].next
              : translations[language].continue}
          </Button>
        </DialogActions>
      </Dialog>

      {celebrate && <ConfettiOverlay isActive />}
    </Box>
  );
};

export default BasicExam;
