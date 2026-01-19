import React, { forwardRef, useEffect, useState } from "react";
import {
  alpha, AppBar, Autocomplete, Box, Button, Card, CardActions, Chip, Dialog,
  Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem,
  Paper, Select, Slide, Stack, TextField, Toolbar, Typography, useTheme
} from "@mui/material";
import {
  Close, Delete, Edit, Add, Assignment, Search, Timer, 
  CheckCircleOutline, Warning, HelpOutline, DragIndicator, ListAlt
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// API Imports
import { examApi } from "../../api/examApi";
import { questionApi } from "../../api/questionApi";
import { levelApi } from "../../api/levelApi";

// Component Imports
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Exam = () => {
  const theme = useTheme();
  
  // Data States
  const [exams, setExams] = useState([]);
  const [questionsPool, setQuestionsPool] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = {
    title: "",
    examType: "Chapter Test",
    level: "",
    questions: [],
    durationMinutes: 30,
    passingScorePercentage: 80,
    description: ""
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
        levelApi.getAllLevel()
      ]);
      // Standardized response access: res.data.data
      setExams(eRes.data.data || []);
      setQuestionsPool(qRes.data.data || []);
      setLevels(lRes.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        ...item,
        level: item.level?._id || item.level,
        questions: item.questions || []
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
        questions: form.questions.map(q => q._id || q)
      };

      if (editItem) {
        await examApi.updateExam(editItem._id, payload);
      } else {
        await examApi.createExam(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
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

  // Drag and Drop Logic
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(form.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setForm({ ...form, questions: items });
  };

  const removeQuestionFromExam = (index) => {
    const updated = [...form.questions];
    updated.splice(index, 1);
    setForm({ ...form, questions: updated });
  };

  const filteredExams = exams.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && exams.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

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
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 3 }}>
        {filteredExams.map((ex) => (
          <Card key={ex._id} sx={{ borderRadius: 4 }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">{ex.title}</Typography>
                <Chip label={ex.level?.code} size="small" color="secondary" />
              </Stack>
              <Chip label={ex.examType} size="small" sx={{ mt: 1 }} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="body2"><ListAlt sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} /> {ex.questions?.length || 0} Questions</Typography>
                <Typography variant="body2"><Timer sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} /> {ex.durationMinutes} Minutes</Typography>
              </Stack>
            </Box>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton color="primary" onClick={() => handleOpenModal(ex)}><Edit fontSize="small" /></IconButton>
              <IconButton color="error" onClick={() => setDeleteId(ex._id)}><Delete fontSize="small" /></IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Full Screen Editor */}
      <Dialog fullScreen open={showModal} onClose={() => setShowModal(false)} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }} elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setShowModal(false)}><Close /></IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editItem ? "Edit Exam Set" : "Create Exam Set"}
            </Typography>
            <Button color="inherit" variant="outlined" onClick={handleSubmit}>Save Exam</Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', width: '100%' }}>
          <Stack spacing={4}>
            {/* Config Section */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>1. Basic Settings</Typography>
              <Stack spacing={3} mt={2}>
                <TextField label="Exam Title" fullWidth value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select value={form.level} label="Level" onChange={(e) => setForm({...form, level: e.target.value})}>
                      {levels.map(l => <MenuItem key={l._id} value={l._id}>{l.code}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={form.examType} label="Type" onChange={(e) => setForm({...form, examType: e.target.value})}>
                      {["Chapter Test", "Module Final", "Mock JLPT", "Mini Quiz"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>

            {/* Selection Section */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>2. Add Questions from Bank</Typography>
              <Autocomplete
                multiple
                options={questionsPool}
                getOptionLabel={(option) => `[${option.category}] ${option.text}`}
                value={form.questions}
                isOptionEqualToValue={(opt, val) => opt._id === val._id}
                onChange={(_, newValue) => setForm({...form, questions: newValue})}
                renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Search and select questions..." />}
                renderTags={() => null} // We display them in the Drag & Drop list instead
              />
            </Box>

            {/* Drag and Drop List */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary">3. Reorder Questions (Drag & Drop)</Typography>
                <Chip label={`${form.questions.length} Selected`} size="small" />
              </Stack>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="exam-questions">
                  {(provided) => (
                    <Stack {...provided.droppableProps} ref={provided.innerRef} spacing={1}>
                      {form.questions.map((q, index) => (
                        <Draggable key={q._id} draggableId={q._id} index={index}>
                          {(provided, snapshot) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              elevation={snapshot.isDragging ? 6 : 1}
                              sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid',
                                borderColor: snapshot.isDragging ? 'primary.main' : 'divider',
                                bgcolor: 'background.paper'
                              }}
                            >
                              <Box {...provided.dragHandleProps} sx={{ mr: 2, display: 'flex' }}>
                                <DragIndicator color="action" />
                              </Box>
                              
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                  QUESTION {index + 1} • {q.category}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {q.text}
                                </Typography>
                              </Box>

                              <IconButton color="error" size="small" onClick={() => removeQuestionFromExam(index)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {form.questions.length === 0 && (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                          <Typography color="text.secondary">No questions selected. Use the search bar above.</Typography>
                        </Paper>
                      )}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </Stack>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Warning color="error" sx={{ fontSize: 40 }} />
          <Typography variant="h6">Delete Exam?</Typography>
          <Typography variant="body2" color="text.secondary">The questions in the bank will not be deleted.</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="center">
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Exam;