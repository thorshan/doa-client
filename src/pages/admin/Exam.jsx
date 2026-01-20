import React, { forwardRef, useEffect, useState } from "react";
import {
  alpha,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  Chip,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
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
  Grid,
} from "@mui/material";
import {
  Close,
  Delete,
  Edit,
  Add,
  Assignment,
  Search,
  Timer,
  DragIndicator,
  ListAlt,
  Article,
  PictureAsPdf,
  Save,
  Warning,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// API Imports
import { examApi } from "../../api/examApi";
import { questionApi } from "../../api/questionApi";
import { levelApi } from "../../api/levelApi";

// Component Imports
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Exam = () => {
  const theme = useTheme();

  // Data States
  const [exams, setExams] = useState([]);
  const [questionsPool, setQuestionsPool] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = {
    title: "",
    examType: "Chapter Test",
    level: "",
    questions: [],
    durationMinutes: 30,
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, qRes, lRes] = await Promise.all([
        examApi.getAllExams(),
        questionApi.getAllQuestions(),
        levelApi.getAllLevel(),
      ]);
      setExams(eRes.data.data || []);
      setQuestionsPool(qRes.data.data || []);
      setLevels(lRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setShowPreview(false);
    if (item) {
      setEditItem(item);
      // Ensure questions have full data for the preview circles
      const detailedQs = (item.questions || []).map((q) => {
        const id = typeof q === "string" ? q : q._id;
        return questionsPool.find((p) => p._id === id) || q;
      });
      setForm({
        ...item,
        level: item.level?._id || item.level,
        questions: detailedQs,
      });
    } else {
      setEditItem(null);
      setForm(initialForm);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        questions: form.questions.map((q) => q._id || q),
      };
      if (editItem) await examApi.updateExam(editItem._id, payload);
      else await examApi.createExam(payload);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await examApi.deleteExam(deleteId);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(form.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setForm({ ...form, questions: items });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentLevel = levels.find((l) => l._id === form.level);
  const filteredExams = exams.filter((ex) =>
    ex.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && exams.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/* PRINT CSS */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #jlpt-print-area, #jlpt-print-area * { visibility: visible; }
            #jlpt-print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
            @page { size: A4; margin: 15mm; }
          }
        `}
      </style>

      {/* Toolbar */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }} alignItems="center">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: 3 }}
        >
          New Exam Set
        </Button>
        <TextField
          size="small"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Stack>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 3,
        }}
      >
        {filteredExams.map((ex) => (
          <Card
            key={ex._id}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="start"
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {ex.title}
                  </Typography>
                  <Chip
                    label={ex.examType}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Chip
                  label={ex.level?.code || "N/A"}
                  size="small"
                  color="secondary"
                />
              </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <ListAlt
                      sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                    />{" "}
                    {ex.questions?.length || 0} Items
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <Timer
                      sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                    />{" "}
                    {ex.durationMinutes} Mins
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <CardActions
              sx={{
                justifyContent: "flex-end",
                bgcolor: alpha(theme.palette.grey[500], 0.02),
              }}
            >
              <IconButton color="primary" onClick={() => handleOpenModal(ex)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton color="error" onClick={() => setDeleteId(ex._id)}>
                <Delete fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Editor & Preview Dialog */}
      <Dialog
        fullScreen
        open={showModal}
        onClose={() => setShowModal(false)}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "relative",
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowModal(false)}
            >
              <Close />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1, fontWeight: "bold" }}
              variant="h6"
            >
              {editItem ? "Edit Exam" : "Create Exam"}
            </Typography>
            <Button
              startIcon={<Article />}
              onClick={() => setShowPreview(!showPreview)}
              sx={{ mr: 2 }}
            >
              {showPreview ? "Back to Editor" : "JLPT Preview"}
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
            >
              Save Exam
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            display: "flex",
            height: "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          {/* EDITOR SECTION */}
          <Box
            sx={{
              flex: showPreview ? 0.4 : 1,
              p: 4,
              overflowY: "auto",
              bgcolor: "background.paper",
            }}
          >
            <Stack spacing={4} sx={{ maxWidth: 800, mx: "auto" }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  1. Basic Settings
                </Typography>
                <Stack spacing={3} mt={2}>
                  <TextField
                    label="Exam Title"
                    fullWidth
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth>
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
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={form.examType}
                        label="Type"
                        onChange={(e) =>
                          setForm({ ...form, examType: e.target.value })
                        }
                      >
                        {[
                          "Level Test",
                          "Chapter Test",
                          "Module Final",
                          "Mock JLPT",
                          "Mini Quiz",
                        ].map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Time (Min)"
                      type="number"
                      sx={{ width: 150 }}
                      value={form.durationMinutes}
                      onChange={(e) =>
                        setForm({ ...form, durationMinutes: e.target.value })
                      }
                    />
                  </Stack>
                </Stack>
              </Paper>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  2. Select Questions
                </Typography>
                <Autocomplete
                  multiple
                  options={questionsPool}
                  getOptionLabel={(option) =>
                    `[${option.category || "Q"}] ${option.text}`
                  }
                  value={form.questions}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  onChange={(_, newValue) =>
                    setForm({ ...form, questions: newValue })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Search questions..."
                    />
                  )}
                  renderTags={() => null}
                />
              </Box>

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    3. Question Sequence
                  </Typography>
                  <Chip
                    label={`${form.questions.length} Items`}
                    size="small"
                    color="primary"
                  />
                </Stack>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="exam-list">
                    {(provided) => (
                      <Stack
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        spacing={1}
                      >
                        {form.questions.map((q, index) => (
                          <Draggable
                            key={q._id}
                            draggableId={q._id}
                            index={index}
                          >
                            {(p, s) => (
                              <Paper
                                ref={p.innerRef}
                                {...p.draggableProps}
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  bgcolor: s.isDragging
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : "background.paper",
                                  border: "1px solid",
                                  borderColor: s.isDragging
                                    ? "primary.main"
                                    : "divider",
                                }}
                              >
                                <Box {...p.dragHandleProps} sx={{ mr: 2 }}>
                                  <DragIndicator color="action" />
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ flexGrow: 1 }}
                                >
                                  <b>{index + 1}.</b> {q.text}
                                </Typography>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    const updated = [...form.questions];
                                    updated.splice(index, 1);
                                    setForm({ ...form, questions: updated });
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Stack>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>
            </Stack>
          </Box>

          {/* PREVIEW SECTION (JLPT STYLE) */}
          {showPreview && (
            <Box
              sx={{
                flex: 0.6,
                bgcolor: "#333",
                p: 4,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                startIcon={<PictureAsPdf />}
                sx={{ mb: 3 }}
                onClick={handlePrint}
              >
                Export Official PDF
              </Button>

              <div
                id="jlpt-print-area"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  padding: "20mm",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "serif",
                  boxSizing: "border-box",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    border: "2px solid black",
                    padding: "15px",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid black",
                      paddingBottom: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {currentLevel?.code || "N?"} - {form.examType}
                    </span>
                    <span>Time Limit: {form.durationMinutes} min</span>
                  </div>
                  <h1
                    style={{
                      textAlign: "center",
                      margin: "15px 0",
                      fontSize: "20pt",
                      textTransform: "uppercase",
                    }}
                  >
                    {form.title}
                  </h1>
                  <div
                    style={{ display: "flex", gap: "20px", marginTop: "10px" }}
                  >
                    <div
                      style={{
                        border: "1px solid black",
                        padding: "5px 10px",
                        flex: 2,
                      }}
                    >
                      受験番号 (ID):{" "}
                    </div>
                    <div
                      style={{
                        border: "1px solid black",
                        padding: "5px 10px",
                        flex: 3,
                      }}
                    >
                      氏名 (Name):{" "}
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px",
                  }}
                >
                  {form.questions.map((q, index) => (
                    <div key={q._id} style={{ pageBreakInside: "avoid" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            background: "#000",
                            color: "#fff",
                            padding: "0 8px",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </span>
                        <div style={{ fontWeight: "bold", fontSize: "12pt" }}>
                          {q.text}
                        </div>
                      </div>

                      {/* BUBBLES */}
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          paddingLeft: "40px",
                        }}
                      >
                        {(q.options || ["", "", "", ""]).map((opt, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                border: "1.5px solid black",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "10pt",
                              }}
                            >
                              {i + 1}
                            </div>
                            <span style={{ fontSize: "11pt" }}>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Warning color="error" sx={{ fontSize: 40 }} />
          <Typography variant="h6">Delete this exam set?</Typography>
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

export default Exam;
