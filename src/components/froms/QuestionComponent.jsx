import React, { forwardRef, useEffect, useState } from "react";
import LoadingComponent from "../LoadingComponent";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { QUESTION_TYPES } from "../../constants/exam";
import { examApi } from "../../api/examApi";
import { questionApi } from "../../api/questionApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QuestionComponent = ({ action, toggle }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({
    exam: "",
    type: "",
    question: "",
    options: [],
    correctAnswer: "",
    explanation: "",
    marks: 0,
  });

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await examApi.getAllExams();
      setExams(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await questionApi.createQuestion(form);
      toggle((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <Dialog
      component="form"
      onSubmit={handleSubmit}
      open={action}
      onClose={toggle}
      slots={{ transition: Transition }}
    >
      <AppBar elevation={0} sx={{ position: "sticky" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggle}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {translations[language]?.addQuestion || "Add Question"}
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
                  const newOptions = form.options.filter((_, i) => i !== idx);
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
            onClick={() => setForm({ ...form, options: [...form.options, ""] })}
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
          onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
        />

        {/* Explanation */}
        <TextField
          label="Explanation"
          color="primary"
          fullWidth
          size="small"
          margin="normal"
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
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
  );
};

export default QuestionComponent;
