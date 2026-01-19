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
import { Close, Delete, Edit, Add, HelpOutline, CheckCircle } from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { chapterApi } from "../../api/chapterApi";
import { levelApi } from "../../api/levelApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { renshuuBApi } from "../../api/renshuuBApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RenshuuB = () => {
  const theme = useTheme();
  
  // Data States
  const [chapters, setChapters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [renshuuBList, setRenshuuBList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [form, setForm] = useState({
    exercises: [{ questionRef: "", question: "", answer: [], correctAnswer: "" }],
    level: "",
    chapter: "",
    relatedKanji: [],
    relatedVocab: [],
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (e.key === "Escape") { setShowSearch(false); setSearch(""); }
    };
    window.addEventListener("keydown", handleKeyDown);
    fetchData();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ch, lvl, kj, vb, rb] = await Promise.all([
        chapterApi.getAllChapter(),
        levelApi.getAllLevel(),
        kanjiApi.getAllKanji(),
        vocabApi.getAllVocab(),
        renshuuBApi.getAllRenshuuB()
      ]);
      setChapters(ch.data.data);
      setLevels(lvl.data);
      setKanjis(kj.data);
      setVocabularies(vb.data);
      setRenshuuBList(rb.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Exercise Logic ---
  const addExercise = () => setForm({ 
    ...form, 
    exercises: [...form.exercises, { questionRef: "", question: "", answer: [], correctAnswer: "" }] 
  });

  const updateExercise = (idx, key, val) => {
    const newEx = [...form.exercises];
    newEx[idx][key] = val;
    setForm({ ...form, exercises: newEx });
  };

  // --- CRUD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        relatedKanji: form.relatedKanji.map(k => k._id || k),
        relatedVocab: form.relatedVocab.map(v => v._id || v)
      };

      if (editItem) {
        await renshuuBApi.updateRenshuuB(editItem._id, payload);
      } else {
        await renshuuBApi.createRenshuuB(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      exercises: item.exercises || [],
      level: item.level?._id || item.level || "",
      chapter: item.chapter?._id || item.chapter || "",
      relatedKanji: item.relatedKanji || [],
      relatedVocab: item.relatedVocab || [],
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await renshuuBApi.deleteRenshuuB(deleteId);
      setShowDeleteModal(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const filteredData = renshuuBList.filter(item => 
    item.chapter?.index?.toString().includes(search) ||
    item.level?.code?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && renshuuBList.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      <Stack direction="row" spacing={2} sx={{ py: 2 }} alignItems="center">
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => {
            setEditItem(null);
            setForm({ exercises: [{ questionRef: "", question: "", answer: [], correctAnswer: "" }], level: "", chapter: "", relatedKanji: [], relatedVocab: [] });
            setShowModal(true);
          }}
          sx={{ borderRadius: 4 }}
        >
          Add Renshuu B
        </Button>
        {showSearch && (
          <TextField
            autoFocus fullWidth size="small" placeholder="Search Chapter or Level..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
          />
        )}
      </Stack>

      <Dialog fullScreen open={showModal} onClose={() => setShowModal(false)} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }} elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setShowModal(false)}><Close /></IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editItem ? `Edit Exercise Set - Chapter ${editItem.chapter?.index}` : "New Renshuu B Exercises"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>Save</Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 900, mx: 'auto', width: '100%' }}>
          <Stack spacing={4}>
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select value={form.level} label="Level" onChange={(e) => setForm({...form, level: e.target.value})}>
                  {levels.map(l => <MenuItem key={l._id} value={l._id}>{l.code}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Chapter</InputLabel>
                <Select value={form.chapter} label="Chapter" onChange={(e) => setForm({...form, chapter: e.target.value})}>
                  {chapters.map(c => <MenuItem key={c._id} value={c._id}>Chapter {c.index}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>

            <Typography variant="h6">Questions & Answers</Typography>
            
            {form.exercises.map((ex, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 3, mb: 2, bgcolor: 'background.paper', position: 'relative' }}>
                <IconButton 
                   size="small" color="error" 
                   sx={{ position: 'absolute', top: 10, right: 10 }}
                   onClick={() => setForm({...form, exercises: form.exercises.filter((_, i) => i !== idx)})}
                >
                  <Delete />
                </IconButton>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Ref (e.g., 1-a)" size="small" sx={{ width: 150 }} value={ex.questionRef} onChange={(e) => updateExercise(idx, "questionRef", e.target.value)} />
                    <TextField label="Question Text" size="small" fullWidth value={ex.question} onChange={(e) => updateExercise(idx, "question", e.target.value)} />
                  </Stack>
                  
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={ex.answer}
                    onChange={(_, newValue) => updateExercise(idx, "answer", newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Answer Options" placeholder="Type and press enter" />
                    )}
                  />

                  <TextField 
                    label="Correct Answer" 
                    size="small" 
                    fullWidth 
                    required
                    value={ex.correctAnswer} 
                    onChange={(e) => updateExercise(idx, "correctAnswer", e.target.value)} 
                    helperText="Must match one of the options or the intended user input."
                  />
                </Stack>
              </Paper>
            ))}
            <Button startIcon={<Add />} variant="outlined" onClick={addExercise}>Add Question</Button>

            <Autocomplete
              multiple options={kanjis} getOptionLabel={(o) => o.character}
              value={form.relatedKanji} onChange={(_, v) => setForm({...form, relatedKanji: v})}
              renderInput={(p) => <TextField {...p} label="Related Kanji" />}
            />

            <Autocomplete
              multiple options={vocabularies} getOptionLabel={(o) => o.word}
              value={form.relatedVocab} onChange={(_, v) => setForm({...form, relatedVocab: v})}
              renderInput={(p) => <TextField {...p} label="Related Vocabulary" />}
            />
          </Stack>
        </Box>
      </Dialog>

      {/* Grid Display */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3, mt: 2 }}>
        {filteredData.map((item) => (
          <Card key={item._id} sx={{ borderRadius: 5 }}>
            <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.8), p: 2, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Practice B</Typography>
              <Typography variant="caption">{item.level?.code} - Ch {item.chapter?.index}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <HelpOutline fontSize="small" color="action" />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.exercises?.length} Questions</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block">
                Sample: {item.exercises[0]?.question.substring(0, 40)}...
              </Typography>
            </Box>
            <CardActions sx={{ justifyContent: 'flex-end', bgcolor: 'grey.50' }}>
              <IconButton color="primary" onClick={() => handleEdit(item)}><Edit fontSize="small" /></IconButton>
              <IconButton color="error" onClick={() => { setDeleteId(item._id); setShowDeleteModal(true); }}><Delete fontSize="small" /></IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Delete Exercise Set?</Typography>
          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
            <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default RenshuuB;