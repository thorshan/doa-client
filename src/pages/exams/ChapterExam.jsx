import {
  Box,
  Container,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  LinearProgress,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { examApi } from "../../api/examApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  EmojiEvents,
  ExpandMore,
} from "@mui/icons-material";
import { progressApi } from "../../api/progressApi";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const PASS_PERCENTAGE = 60;

const ChapterExam = () => {
  const { user } = useAuth();
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [userData, setUser] = useState(user);

  /* ================= STATE ================= */

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState("");

  /* ================= FETCH USER ================= */

  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userApi.getUserData();
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ================= FETCH EXAM ================= */

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await examApi.getExamByLecture(lectureId);
        setExam(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load exam");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [lectureId]);

  /* ================= DERIVED DATA ================= */

  const questions = exam?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentStep];

  const correctCount = useMemo(() => {
    return questions.reduce((count, q) => {
      return answers[q._id] === q.correctAnswer ? count + 1 : count;
    }, 0);
  }, [answers, questions]);

  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const passed = percentage >= PASS_PERCENTAGE;

  const progress =
    totalQuestions > 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;

  /* ================= SAVE PROGRESS (🔥 FIX) ================= */

  const handlePassed = async () => {
    const data = {
      userId: userData._id,
      lecture: lectureId,
      score: percentage,
    };

    try {
      await progressApi.passTest(data);
      fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFinished && passed) {
      handlePassed();
    }
  }, [isFinished, passed]);

  /* ================= EARLY RETURNS ================= */

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!exam || totalQuestions === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Typography>No exam available.</Typography>
      </Container>
    );
  }

  /* ================= HANDLERS ================= */

  const handleOptionChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion._id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsFinished(false);
  };

  /* ================= EXAM UI ================= */

  if (!isFinished) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight="bold"
          sx={{ my: 2 }}
        >
          {exam.title}
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="overline">
            Question {currentStep + 1} of {totalQuestions}
          </Typography>

          <LinearProgress
            value={progress}
            variant="determinate"
            sx={{ my: 2 }}
          />

          <Fade in key={currentStep}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {currentQuestion.question}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {currentQuestion.explanation}
              </Typography>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <RadioGroup
                  value={answers[currentQuestion._id] || ""}
                  onChange={handleOptionChange}
                >
                  {currentQuestion.options.map((opt, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ mb: 1, px: 2 }}>
                      <FormControlLabel
                        value={opt}
                        control={<Radio />}
                        label={opt}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Fade>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              disabled={currentStep === 0}
              onClick={handleBack}
              startIcon={<ChevronLeft />}
            >
              Back
            </Button>

            <Button
              variant="contained"
              disabled={!answers[currentQuestion._id]}
              onClick={handleNext}
              endIcon={
                currentStep === totalQuestions - 1 ? (
                  <CheckCircle />
                ) : (
                  <ChevronRight />
                )
              }
            >
              {currentStep === totalQuestions - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  /* ================= RESULT ================= */

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
        <EmojiEvents sx={{ fontSize: 64, color: "primary.main" }} />

        <Typography variant="h4" fontWeight="bold">
          Exam Completed
        </Typography>

        <Typography variant="h6" sx={{ mt: 1 }}>
          Score: {percentage}%
        </Typography>

        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Test Result Data</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {questions.map((q, index) => {
              const userAnswer = answers[q._id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <Paper
                  key={q._id}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    borderColor: isCorrect ? "success.main" : "error.main",
                  }}
                >
                  <Typography fontWeight={600}>
                    {index + 1}. {q.question}
                  </Typography>

                  <Typography variant="body2">
                    Your Answer:
                    <Chip
                      label={userAnswer || "Not Answered"}
                      color={isCorrect ? "success" : "error"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  {!isCorrect && (
                    <Typography variant="body2" color="success.main">
                      Correct Answer: {q.correctAnswer}
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </AccordionDetails>
        </Accordion>

        {passed ? (
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/app/grammar")}
          >
            Continue
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={handleRestart}
          >
            Retry Exam
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default ChapterExam;
