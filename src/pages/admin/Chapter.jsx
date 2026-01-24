import {
  alpha,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { Close, Delete, Edit, Settings } from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { chapterApi } from "../../api/chapterApi";
import { levelApi } from "../../api/levelApi";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { examApi } from "../../api/examApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Chapter = () => {
  const theme = useTheme();
  const { language } = useLanguage();
  const [chapters, setChapters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editChapter, setEditChapter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteChapterId, setDeleteChapterId] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    index: "",
    level: "",
    exam: "",
  });

  // Hotkey Search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (event.key === "Escape") {
        setShowSearch(false);
        setSearch("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chRes, lvlRes, examRes] = await Promise.all([
        chapterApi.getAllChapter(),
        levelApi.getAllLevel(),
        examApi.getAllExams(),
      ]);
      setChapters(chRes.data.data);
      setLevels(lvlRes.data);
      setExams(examRes.data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleOpenModal = (chapter = null) => {
    if (chapter) {
      setEditChapter(chapter);
      setForm({
        index: chapter.index,
        level: chapter.level?._id || chapter.level,
        exam: chapter.exam?._id || chapter.exam,
      });
    } else {
      setEditChapter(null);
      setForm({ index: "", level: "" , exam: ""});
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editChapter) {
        await chapterApi.updateChapter(editChapter._id, form);
      } else {
        await chapterApi.createChapter(form);
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await chapterApi.deleteChapter(deleteChapterId);
      setShowDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredChapters = chapters.filter(
    (ch) =>
      ch.index.toString().includes(search) ||
      ch.level?.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && chapters.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/* Search Bar */}
      <Box sx={{ py: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          startIcon={<Settings />}
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: 4 }}
        >
          Add Chapter
        </Button>
        {showSearch && (
          <TextField
            placeholder="Search Index or Level..."
            fullWidth
            autoFocus
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
          />
        )}
      </Box>

      {/* Create/Edit Modal */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
      >
        <AppBar elevation={0} sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowModal(false)}
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editChapter ? "Edit Chapter" : "Add New Chapter"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <TextField
            label="Chapter Index"
            type="number"
            fullWidth
            margin="normal"
            size="small"
            value={form.index}
            onChange={(e) => setForm({ ...form, index: e.target.value })}
          />
          <FormControl fullWidth size="small" margin="normal">
            <InputLabel>Level</InputLabel>
            <Select
              label="Level"
              value={form.level}
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
            <InputLabel>Exam</InputLabel>
            <Select
              label="Exam"
              value={form.exam}
              onChange={(e) => setForm({ ...form, exam: e.target.value })}
            >
              {exams.map((ex) => (
                <MenuItem key={ex._id} value={ex._id}>
                  {ex.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <Dialog
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Caution
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete this chapter?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/* Chapter Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          mt: 2,
        }}
      >
        {filteredChapters.map((ch) => (
          <Card key={ch._id} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                p: 2,
                color: "white",
              }}
            >
              <Typography variant="subtitle1">Chapter {ch.index}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Level : {" "}
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {ch.level?.code}
                </Box>
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Exam : {" "}
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {ch.exam?.title}
                </Box>
              </Typography>
            </Box>
            <CardActions
              sx={{ justifyContent: "flex-end", bgcolor: "grey.50" }}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenModal(ch)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setDeleteChapterId(ch._id);
                  setShowDeleteModal(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Chapter;
