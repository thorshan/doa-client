import {
  AppBar,
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import TitleComponent from "../../components/TitleComponent";
import { examApi } from "../../api/examApi";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { EXAM_TYPES, QUESTION_TYPES } from "../../constants/exam";
import { questionApi } from "../../api/questionApi";
import { Close, Delete, Edit } from "@mui/icons-material";
import LoadingComponent from "../../components/LoadingComponent";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Question = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(false);
  const [form, setForm] = useState({
    exam: "",
    type: "",
    question: "",
    options: [],
    correctAnswer: "",
    explanation: "",
    marks: 0,
  });

  // Fetch Exams
  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await examApi.getAllExams();
      setExams(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch Question
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await questionApi.getAllQuestions();
      setQuestions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle Edit
  const handleEdit = (exam) => {
    setForm({
      exam: exam.exam._id,
      type: exam.type || "",
      question: exam.question || "",
      options: exam.options || [],
      correctAnswer: exam.correctAnswer || "",
      explanation: exam.explanation || "",
      marks: exam.marks || 0,
    });
    setEditQuestion(exam);
    setShowModal(true);
  };

  // Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await questionApi.updateQuestion(editQuestion._id, form);
      fetchQuestions();
    } catch (error) {
      console.error(error.message);
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteQuestionId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteQuestionId) {
      await questionApi.deleteQuestion(deleteQuestionId);
      setShowDeleteModal(false);
      setDeleteQuestionId(null);
      fetchQuestions();
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/*  */}
      {showModal && (
        <Dialog
          component="form"
          onSubmit={handleSubmit}
          open={showModal}
          onClose={() => setShowModal(false)}
          slots={{ transition: Transition }}
        >
          <AppBar elevation={0} sx={{ position: "sticky" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setShowModal(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {translations[language]?.addExam || "Add Exam"}
              </Typography>
              <Button type="submit" color="inherit">
                {translations[language]?.save || "Save"}
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Exam</InputLabel>
              <Select
                value={form.exam}
                required
                label="Exam"
                onChange={(e) => setForm({ ...form, exam: e.target.value })}
              >
                {exams.map((exam) => (
                  <MenuItem key={exam._id} value={exam._id}>
                    {exam.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Question Type */}
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Question Type</InputLabel>
              <Select
                value={form.type}
                required
                label="Question Type"
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {Object.keys(QUESTION_TYPES).map((key) => (
                  <MenuItem key={key} value={QUESTION_TYPES[key]}>
                    {QUESTION_TYPES[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Question Text */}
            <TextField
              label="Question"
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />

            {/* Options with add/remove */}
            <Box sx={{ my: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Options
              </Typography>

              {form.options.map((opt, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
                >
                  <TextField
                    label={`Option ${idx + 1}`}
                    color="primary"
                    fullWidth
                    size="small"
                    value={form.options[idx]}
                    onChange={(e) => {
                      const newOptions = [...form.options];
                      newOptions[idx] = e.target.value;
                      setForm({ ...form, options: newOptions });
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      const newOptions = form.options.filter(
                        (_, i) => i !== idx
                      );
                      setForm({ ...form, options: newOptions });
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}

              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setForm({ ...form, options: [...form.options, ""] })
                }
              >
                Add Option
              </Button>
            </Box>

            {/* Correct Answer */}
            <TextField
              label="Correct Answer"
              color="primary"
              required
              fullWidth
              size="small"
              margin="normal"
              value={form.correctAnswer}
              onChange={(e) =>
                setForm({ ...form, correctAnswer: e.target.value })
              }
            />

            {/* Explanation */}
            <TextField
              label="Explanation"
              color="primary"
              fullWidth
              size="small"
              margin="normal"
              value={form.explanation}
              onChange={(e) =>
                setForm({ ...form, explanation: e.target.value })
              }
            />

            {/* Marks */}
            <TextField
              label="Marks"
              color="primary"
              type="number"
              fullWidth
              size="small"
              margin="normal"
              value={form.marks}
              onChange={(e) =>
                setForm({ ...form, marks: parseInt(e.target.value) })
              }
            />
          </Box>
        </Dialog>
      )}

      {showDeleteModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            animation: "fadeIn 0.3s",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              {translations[language].caution || "Caution"}
            </Typography>
            <Typography mb={3}>
              {translations[language].delete_confirm ||
                "Are you sure want to delete?"}
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setShowDeleteModal(false)}
              >
                {translations[language].cancel || "Cancel"}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                {translations[language].delete || "Delete"}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Box sx={{ my: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{question.exam?.title || "N/A"}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>{question.question || "N/A"}</TableCell>
                  <TableCell>{question.marks || "N/A"}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <IconButton onClick={() => handleEdit(question)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton
                          onClick={() => openDeleteModal(question._id)}
                        >
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Question;
