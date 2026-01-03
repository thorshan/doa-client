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
import { EXAM_TYPES } from "../../constants/exam";
import { moduleApi } from "../../api/moduleApi";
import { levelApi } from "../../api/levelApi";
import { Close, Delete, Edit } from "@mui/icons-material";
import LoadingComponent from "../../components/LoadingComponent";
import { lessonApi } from "../../api/lessonApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Exam = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [exams, setExams] = useState([]);
  const [editExam, setEditExam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    level: "",
    module: "",
    lesson: "",
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

  // Fetch Levels
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await levelApi.getAllLevel();
        setLevels(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLevel();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await moduleApi.getAllModules();
      setModules(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await lessonApi.getAllLesson();
      setLessons(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);

  // Handle Edit
  const handleEdit = (exam) => {
    setForm({
      title: exam.title || "",
      type: exam.type || "",
      level: exam.level?._id || exam.level || "",
      module: exam.module?._id || exam.module || "",
      lesson: exam.lesson?._id || exam.lesson || "",
    });
    setEditExam(exam);
    setShowModal(true);
  };

  // Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await examApi.updateExam(editExam._id, form);
      fetchExams();
    } catch (error) {
      console.error(error.message);
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteExamId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteExamId) {
      await examApi.deleteExam(deleteExamId);
      setShowDeleteModal(false);
      setDeleteExamId(null);
      fetchExams();
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
            <TextField
              label={translations[language]?.title || "Title"}
              required
              fullWidth
              size="small"
              margin="normal"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Exam Type</InputLabel>
              <Select
                value={form.type}
                required
                label="Exam Type"
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {Object.keys(EXAM_TYPES).map((key) => (
                  <MenuItem key={key} value={EXAM_TYPES[key]}>
                    {EXAM_TYPES[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Exam Level</InputLabel>
              <Select
                value={form.level}
                required
                label="Level"
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {levels.map((lvl) => (
                  <MenuItem key={lvl._id} value={lvl._id}>
                    {lvl.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Module</InputLabel>
              <Select
                value={form.module}
                required
                label="Module"
                onChange={(e) => setForm({ ...form, module: e.target.value })}
              >
                {modules.map((mod) => (
                  <MenuItem key={mod._id} value={mod._id}>
                    {mod.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Lesson</InputLabel>
              <Select
                value={form.lesson}
                required
                label="Lesson"
                onChange={(e) => setForm({ ...form, lesson: e.target.value })}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson._id} value={lesson._id}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Module</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.length > 0 ? (
              exams.map((exam, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.type}</TableCell>
                  <TableCell>{exam.level?.code || "N/A"}</TableCell>
                  <TableCell>{exam.module?.key || "N/A"}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <IconButton onClick={() => handleEdit(exam)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(exam._id)}>
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

export default Exam;
