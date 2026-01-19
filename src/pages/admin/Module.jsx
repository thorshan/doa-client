import {
  alpha,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  Dialog,
  Divider,
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
import {
  Close,
  Delete,
  Edit,
  Add,
  Layers,
  School,
  ChevronRight,
  Warning,
} from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { moduleApi } from "../../api/moduleApi";
import { levelApi } from "../../api/levelApi";
import { chapterApi } from "../../api/chapterApi";
import { examApi } from "../../api/examApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Module = () => {
  const theme = useTheme();

  // Data States
  const [modules, setModules] = useState([]);
  const [levels, setLevels] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = {
    name: "",
    level: "",
    chapters: [],
    exam: "",
    passingScorePercentage: 80,
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, lRes, cRes, eRes] = await Promise.all([
        moduleApi.getAllModules(),
        levelApi.getAllLevel(),
        chapterApi.getAllChapter(),
        examApi.getAllExams(),
      ]);
      setModules(mRes.data.data);
      setLevels(lRes.data);
      setChapters(cRes.data.data);
      setExams(eRes.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        chapters: form.chapters.map((c) => c._id || c),
        exam: form.exam || null,
      };

      if (editItem) {
        await moduleApi.updateModule(editItem._id, payload);
      } else {
        await moduleApi.createModule(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      level: item.level?._id || item.level,
      chapters: item.chapters || [],
      exam: item.exam?._id || item.exam || "",
      passingScorePercentage: item.passingScorePercentage || 80,
      isActive: item.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await moduleApi.deleteModule(deleteId);
      setShowDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && modules.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      <Stack sx={{ py: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditItem(null);
            setForm(initialForm);
            setShowModal(true);
          }}
          sx={{ width: "fit-content", borderRadius: 4 }}
        >
          New Module
        </Button>
      </Stack>

      <Dialog
        fullScreen
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowModal(false)}
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editItem
                ? `Edit Module: ${editItem.name}`
                : "Create New Curriculm Module"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>
              Save Module
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 800, mx: "auto", width: "100%" }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Basic Information
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Module Name"
                  fullWidth
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={form.level}
                    label="Level"
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value })
                    }
                  >
                    {levels.map((l) => (
                      <MenuItem key={l._id} value={l._id}>
                        {l.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Chapter Sequence
              </Typography>
              <Autocomplete
                multiple
                options={chapters}
                getOptionLabel={(option) =>
                  `Chapter ${option.index}`
                }
                value={form.chapters}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                onChange={(_, newValue) =>
                  setForm({ ...form, chapters: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign & Order Chapters"
                    placeholder="Search chapters..."
                  />
                )}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Final Assessment
              </Typography>
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Select Final Exam</InputLabel>
                  <Select
                    value={form.exam}
                    label="Select Final Exam"
                    onChange={(e) => setForm({ ...form, exam: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>No Exam Attached</em>
                    </MenuItem>
                    {exams.map((ex) => (
                      <MenuItem key={ex._id} value={ex._id}>
                        {ex.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Pass Score (%)"
                  type="number"
                  sx={{ width: 150 }}
                  value={form.passingScorePercentage}
                  onChange={(e) =>
                    setForm({ ...form, passingScorePercentage: e.target.value })
                  }
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Dialog>

      {/* Grid Display */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 3,
        }}
      >
        {modules.map((m) => (
          <Card
            key={m._id}
            sx={{ borderRadius: 4, display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" noWrap>
                  {m.name}
                </Typography>
                <Layers color="primary" />
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  px: 1,
                  borderRadius: 1,
                }}
              >
                {m.level?.code}
              </Typography>
            </Box>

            <Box sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Chapters ({m.chapters?.length})
              </Typography>
              <Stack spacing={0.5} sx={{ mb: 2 }}>
                {m.chapters?.slice(0, 3).map((ch, i) => (
                  <Typography
                    key={ch._id}
                    variant="caption"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <ChevronRight fontSize="inherit" /> Ch {ch.index}:{" "}
                    {ch.title}
                  </Typography>
                ))}
                {m.chapters?.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    ...and {m.chapters.length - 3} more
                  </Typography>
                )}
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Stack direction="row" alignItems="center" spacing={1}>
                <School
                  fontSize="small"
                  color={m.exam ? "success" : "disabled"}
                />
                <Typography variant="caption" fontWeight="bold">
                  Exam: {m.exam ? m.exam.title : "Not Assigned"}
                </Typography>
              </Stack>
            </Box>

            <CardActions
              sx={{ justifyContent: "flex-end", p: 1, bgcolor: "grey.50" }}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(m)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setDeleteId(m._id);
                  setShowDeleteModal(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Warning color="error" sx={{ fontSize: 40 }} />
          <Typography variant="h6">Delete Module?</Typography>
          <Typography variant="body2" color="text.secondary">
            This will unbind all chapters from this module group.
          </Typography>
          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
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
    </Box>
  );
};

export default Module;
