import {
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
  AppBar,
  useTheme,
  Chip,
  InputAdornment,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import {
  Close,
  Delete,
  Edit,
  Add,
  Search,
  HelpOutline,
  AudioFile,
  Image as ImageIcon,
  Warning,
} from "@mui/icons-material";
import { questionApi } from "../../api/questionApi";
import { levelApi } from "../../api/levelApi";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = {
    text: "",
    audioUrl: "",
    imageUrl: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    level: "",
    category: "Vocabulary",
    points: 1,
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, lRes] = await Promise.all([
        questionApi.getAllQuestions(),
        levelApi.getAllLevel(),
      ]);
      setQuestions(qRes.data.data);
      setLevels(lRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editItem) await questionApi.updateQuestion(editItem._id, form);
      else await questionApi.createQuestion(form);
      setShowModal(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    await questionApi.deleteQuestion(deleteId);
    setDeleteId(null);
    fetchData();
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.text?.toLowerCase().includes(search.toLowerCase()) ||
      q.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && questions.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditItem(null);
            setForm(initialForm);
            setShowModal(true);
          }}
        >
          New Question
        </Button>
        <TextField
          size="small"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 2,
        }}
      >
        {filteredQuestions.map((q) => (
          <Card
            key={q._id}
            sx={{ p: 2, borderRadius: 3, position: "relative" }}
          >
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip label={q.category} size="small" color="secondary" />
              <Chip label={q.level?.code} size="small" variant="outlined" />
            </Stack>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
              {q.text}
            </Typography>

            <Stack spacing={0.5} sx={{ mb: 2 }}>
              {q.options.map((opt, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  sx={{
                    color:
                      i === q.correctOptionIndex
                        ? "success.main"
                        : "text.secondary",
                    fontWeight: i === q.correctOptionIndex ? "bold" : "normal",
                  }}
                >
                  {i + 1}. {opt} {i === q.correctOptionIndex && "✓"}
                </Typography>
              ))}
            </Stack>

            <Divider />
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
              <IconButton
                onClick={() => {
                  setEditItem(q);
                  setForm(q);
                  setShowModal(true);
                }}
                size="small"
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => setDeleteId(q._id)}
                size="small"
                color="error"
              >
                <Delete />
              </IconButton>
            </Stack>
          </Card>
        ))}
      </Box>

      {/* Editor Dialog */}
      <Dialog
        fullScreen
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowModal(false)}
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editItem ? "Edit Question" : "Create Question"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>
              Save to Bank
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4, maxWidth: 800, mx: "auto", width: "100%" }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={form.level?._id || form.level}
                  label="Level"
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  {levels.map((l) => (
                    <MenuItem key={l._id} value={l._id}>
                      {l.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {[
                    "Grammar",
                    "Vocabulary",
                    "Kanji",
                    "Listening",
                    "Reading",
                  ].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Question Text"
              multiline
              rows={3}
              fullWidth
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Audio URL"
                fullWidth
                size="small"
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <AudioFile sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
              <TextField
                label="Image URL"
                fullWidth
                size="small"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <ImageIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              Options (Select the correct radio)
            </Typography>
            <RadioGroup
              value={form.correctOptionIndex}
              onChange={(e) =>
                setForm({
                  ...form,
                  correctOptionIndex: parseInt(e.target.value),
                })
              }
            >
              {form.options.map((opt, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Radio value={i} />
                  <TextField
                    fullWidth
                    label={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...form.options];
                      newOpts[i] = e.target.value;
                      setForm({ ...form, options: newOpts });
                    }}
                  />
                </Stack>
              ))}
            </RadioGroup>
          </Stack>
        </Box>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Warning color="error" sx={{ fontSize: 40 }} />
          <Typography variant="h6">Delete this question?</Typography>
          <Typography variant="body2" color="text.secondary">
            This will remove it from all exams using it.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3 }}
            justifyContent="center"
          >
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Questions;
