import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import TitleComponent from "../../components/TitleComponent";
import { CheckBox, Close, Delete, Edit, Square } from "@mui/icons-material";
import React, { forwardRef, useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { lessonApi } from "../../api/lessonApi";
import { translations } from "../../constants/translations";
import { levelApi } from "../../api/levelApi";
import { moduleApi } from "../../api/moduleApi";
import { grammarApi } from "../../api/grammarApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { speakingApi } from "../../api/speakingApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Lesson = () => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [modules, setModules] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [speakings, setSpeakings] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [editLesson, setEditLesson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState(false);
  const [form, setForm] = useState({
    title: "",
    level: "",
    module: "",
    grammarPatterns: [],
    kanji: [],
    vocabulary: [],
    speaking: null,
    examples: [],
    contentBlocks: null,
  });

  // Fetch Modules
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await lessonApi.getAllLesson();
      setLessons(res.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Fetch Data
  useEffect(() => {
    levelApi.getAllLevel().then((r) => setLevels(r.data));
    moduleApi.getAllModules().then((r) => setModules(r.data));
    grammarApi.getAllGrammar().then((r) => setGrammars(r.data));
    kanjiApi.getAllKanji().then((r) => setKanjis(r.data));
    vocabApi.getAllVocab().then((r) => setVocabularies(r.data));
    speakingApi.getAllSpeaking().then((r) => setSpeakings(r.data));
  }, []);

  // Handle Edit
  const handleEdit = (lesson) => {
    setForm({
      title: lesson.title || "",
      level: lesson.level?._id || lesson.level || "",
      module: lesson.module?._id || lesson.module || "",
      grammarPatterns: lesson.grammarPatterns || [],
      kanji: lesson.kanji || [],
      vocabulary: lesson.vocabulary || [],
      speaking: lesson.speaking || null,
      examples: lesson.examples || [],
      contentBlocks: null,
    });
    setEditLesson(lesson);
    setShowModal(true);
  };

  // Handle Submit
  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      ...form,
      grammarPatterns:
        form.grammarPatterns !== form.grammarPatterns
          ? form.grammarPatterns.split(",")
          : form.grammarPatterns,
      kanji: form.kanji !== form.kanji ? form.kanji.split(",") : form.kanji,
      vocabulary:
        form.vocabulary !== form.vocabulary
          ? form.vocabulary.split(",")
          : form.vocabulary,
    };
    try {
      await lessonApi.updateLesson(editLesson._id, formData);
      fetchLessons();
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteLessonId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteLessonId) {
      await lessonApi.deleteLesson(deleteLessonId);
      setShowDeleteModal(false);
      setDeleteLessonId(null);
      fetchLessons();
    }
  };

  if (loading) return <LoadingComponent />;
  return (
    <Box>
      <TitleComponent />

      {showModal && (
        <React.Fragment>
          <Dialog
            component={"form"}
            onSubmit={handleSubmit}
            open={showModal}
            onClose={() => setShowModal(false)}
            slots={{
              transition: Transition,
            }}
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
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Add new data
                </Typography>
                <Button type="submit" color="inherit">
                  Save
                </Button>
              </Toolbar>
            </AppBar>
            <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
              <TextField
                label="Title"
                color="primary"
                required
                fullWidth
                size="small"
                margin="normal"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel htmlFor="level">Level</InputLabel>
                <Select
                  labelId="level-label"
                  label="Level"
                  value={form.level}
                  required
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  {levels.map((level) => (
                    <MenuItem key={level._id} value={level._id}>
                      {level.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel htmlFor="level">Module</InputLabel>
                <Select
                  labelId="module-label"
                  label="Module"
                  value={form.module}
                  required
                  onChange={(e) => setForm({ ...form, module: e.target.value })}
                >
                  {modules.map((module) => (
                    <MenuItem key={module._id} value={module._id}>
                      {module.key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  multiple
                  size="small"
                  options={grammars}
                  disableCloseOnSelect
                  value={form.grammarPatterns}
                  onChange={(event, newValue) => {
                    setForm({ ...form, grammarPatterns: newValue });
                  }}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        <Checkbox
                          icon={<Square size={20} />}
                          checkedIcon={<CheckBox size={20} />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.title}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Grammar Patterns"
                      placeholder={
                        form.grammarPatterns.length === 0
                          ? "Search Grammar ..."
                          : ""
                      }
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  multiple
                  size="small"
                  options={kanjis}
                  disableCloseOnSelect
                  value={form.kanji}
                  onChange={(event, newValue) => {
                    setForm({ ...form, kanji: newValue });
                  }}
                  getOptionLabel={(option) => option.character}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        <Checkbox
                          icon={<Square size={20} />}
                          checkedIcon={<CheckBox size={20} />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.character}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      modules
                      label="Add Kanji"
                      placeholder={
                        form.kanji.length === 0 ? "Search Kanji ..." : ""
                      }
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  multiple
                  size="small"
                  options={vocabularies}
                  disableCloseOnSelect
                  value={form.vocabulary}
                  onChange={(event, newValue) => {
                    setForm({ ...form, vocabulary: newValue });
                  }}
                  getOptionLabel={(option) => option.word}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        <Checkbox
                          icon={<Square size={20} />}
                          checkedIcon={<CheckBox size={20} />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.word}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Vocabulary"
                      placeholder={
                        form.vocabulary.length === 0
                          ? "Search Vocabulary ..."
                          : ""
                      }
                    />
                  )}
                />
              </FormControl>
              <Autocomplete
                sx={{ mt: 2 }}
                options={speakings}
                value={form.speaking}
                getOptionLabel={(o) => o.description}
                onChange={(e, v) => setForm({ ...form, speaking: v })}
                renderInput={(params) => (
                  <TextField {...params} label="Related Speaking" />
                )}
              />
            </Box>
          </Dialog>
        </React.Fragment>
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

      {/* Data */}
      <Box sx={{ my: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Module</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>
                    {lesson.level ? lesson.level?.code : "N/A"}
                  </TableCell>
                  <TableCell>
                    {lesson.module ? lesson.module?.key : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <IconButton onClick={() => handleEdit(lesson)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(lesson._id)}>
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

export default Lesson;
