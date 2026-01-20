import React, { useEffect, useState, forwardRef } from "react";
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
  IconButton,
  Paper,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
  Grid,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Close,
  Delete,
  Edit,
  Add,
  DragIndicator,
  PictureAsPdf,
  Article,
  Save,
  AccessTime,
  Assignment,
  Layers,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// API Imports
import { examApi } from "../../api/examApi";
import { questionApi } from "../../api/questionApi";
import { levelApi } from "../../api/levelApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Exam = () => {
  const theme = useTheme();

  // --- CONSTANTS ---
  const EXAM_TYPES = [
    "Level Test",
    "Chapter Test",
    "Module Final",
    "Mock JLPT",
    "Mini Quiz",
  ];

  // --- STATE ---
  const [exams, setExams] = useState([]);
  const [questionsPool, setQuestionsPool] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    examType: "Final Exam",
    level: "",
    durationMinutes: 60,
    questions: [],
  });

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
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    setShowPreview(false);
    if (item) {
      setEditId(item._id);
      const detailedQs = (item.questions || []).map((q) => {
        const id = typeof q === "string" ? q : q._id;
        return questionsPool.find((p) => p._id === id) || q;
      });
      setForm({
        title: item.title || "",
        examType: item.examType || "Final Exam",
        level: item.level?._id || item.level || "",
        durationMinutes: item.durationMinutes || 60,
        questions: detailedQs,
      });
    } else {
      setEditId(null);
      setForm({
        title: "",
        examType: "Final Exam",
        level: "",
        durationMinutes: 60,
        questions: [],
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = { ...form, questions: form.questions.map((q) => q._id) };
    try {
      if (editId) await examApi.updateExam(editId, payload);
      else await examApi.createExam(payload);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      examApi.deleteExam(id).then(() => fetchData());
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

  return (
    <Box sx={{ p: 4 }}>
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #exam-print-area, #exam-print-area * { visibility: visible; }
            #exam-print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
            .no-print { display: none !important; }
            @page { size: A4; margin: 20mm; }
          }
        `}
      </style>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Exam Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Create Exam
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {exams.map((ex) => (
          <Grid item xs={12} sm={6} md={4} key={ex._id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                position: "relative",
                overflow: "visible",
                "&:hover": { boxShadow: theme.shadows[4] },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Typography variant="h6" noWrap fontWeight="bold">
                  {ex.title}
                </Typography>
                <Chip
                  label={ex.examType}
                  size="small"
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Layers sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2">
                      Level: <b>{ex.level?.code || "N/A"}</b>
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTime
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      Duration: <b>{ex.durationMinutes} mins</b>
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Assignment
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      Questions: <b>{ex.questions?.length || 0} items</b>
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              <CardActions
                sx={{
                  justifyContent: "flex-end",
                  bgcolor: "background.transparent",
                }}
              >
                <IconButton color="primary" onClick={() => handleOpenModal(ex)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(ex._id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
            borderBottom: "1px solid #e0e0e0",
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => setShowModal(false)}>
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: "bold" }}>
              {editId ? "Edit Exam" : "New Exam"}
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
              onClick={handleSave}
            >
              Save
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
            <Stack spacing={3} sx={{ maxWidth: 700, mx: "auto" }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Exam Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Level"
                      value={form.level}
                      onChange={(e) =>
                        setForm({ ...form, level: e.target.value })
                      }
                    >
                      {levels.map((l) => (
                        <MenuItem key={l._id} value={l._id}>
                          {l.code}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Exam Type"
                      value={form.examType}
                      onChange={(e) =>
                        setForm({ ...form, examType: e.target.value })
                      }
                    >
                      {EXAM_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Time (Mins)"
                      value={form.durationMinutes}
                      onChange={(e) =>
                        setForm({ ...form, durationMinutes: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Autocomplete
                multiple
                options={questionsPool}
                getOptionLabel={(o) => o.text || ""}
                value={form.questions}
                isOptionEqualToValue={(o, v) => o._id === v._id}
                onChange={(_, val) => setForm({ ...form, questions: val })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Questions"
                    variant="outlined"
                  />
                )}
              />

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="exam-items">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {form.questions.map((q, index) => (
                        <Draggable
                          key={q._id}
                          draggableId={q._id}
                          index={index}
                        >
                          {(p) => (
                            <Paper
                              ref={p.innerRef}
                              {...p.draggableProps}
                              sx={{
                                p: 2,
                                mb: 1,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box {...p.dragHandleProps} sx={{ mr: 2 }}>
                                <DragIndicator color="action" />
                              </Box>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {index + 1}. {q.text}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  const copy = [...form.questions];
                                  copy.splice(index, 1);
                                  setForm({ ...form, questions: copy });
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Stack>
          </Box>

          {/* PREVIEW SECTION (JLPT BUBBLE STYLE) */}
          {showPreview && (
            <Box
              sx={{
                flex: 0.6,
                bgcolor: "#454545",
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
                className="no-print"
              >
                Print Official Sheet
              </Button>

              <div
                id="exam-print-area"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  padding: "20mm",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "'MS Mincho', 'Sawarabi Mincho', serif",
                  boxSizing: "border-box",
                }}
              >
                {/* JLPT Header Style */}
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
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontSize: "14pt", fontWeight: "bold" }}>
                      {currentLevel?.code || "N?"} {form.examType}
                    </span>
                    <span style={{ fontSize: "12pt" }}>
                      Time: {form.durationMinutes} min
                    </span>
                  </div>
                  <h1
                    style={{
                      textAlign: "center",
                      margin: "10px 0",
                      fontSize: "20pt",
                    }}
                  >
                    {form.title?.toUpperCase() || "EXAMINATION"}
                  </h1>
                  <div
                    style={{ marginTop: "15px", display: "flex", gap: "20px" }}
                  >
                    <div
                      style={{
                        border: "1px solid black",
                        padding: "5px 15px",
                        flex: 2,
                      }}
                    >
                      Name: __________________________
                    </div>
                    <div
                      style={{
                        border: "1px solid black",
                        padding: "5px 15px",
                        flex: 1,
                      }}
                    >
                      ID: ____________
                    </div>
                  </div>
                </div>

                {/* Questions with Circles */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {form.questions.map((q, index) => (
                    <div
                      key={q._id || index}
                      style={{
                        pageBreakInside: "avoid",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            background: "#000",
                            color: "#fff",
                            padding: "0 8px",
                            height: "24px",
                          }}
                        >
                          {index + 1}
                        </span>
                        <div style={{ fontWeight: "bold", fontSize: "12pt" }}>
                          {q.text}
                        </div>
                      </div>

                      {q.options && q.options.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "20px",
                            paddingLeft: "40px",
                          }}
                        >
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              {/* JLPT Bubble Style */}
                              <div
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  border: "1.5px solid black",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10pt",
                                  fontWeight: "bold",
                                }}
                              >
                                {i + 1}
                              </div>
                              <span style={{ fontSize: "11pt" }}>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Exam;
