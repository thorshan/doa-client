import {
  alpha,
  AppBar,
  Autocomplete,
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
import { Close, Delete, Edit, Add, Forum, RecordVoiceOver } from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { chapterApi } from "../../api/chapterApi";
import { levelApi } from "../../api/levelApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { renshuuCApi } from "../../api/renshuuCApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RenshuuC = () => {
  const theme = useTheme();
  
  // Data States
  const [chapters, setChapters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [renshuuCList, setRenshuuCList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [form, setForm] = useState({
    title: "",
    scenario: "",
    dialogue: [{ speaker: "A", sentence: "", meaning: "" }],
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
      const [ch, lvl, kj, vb, rc] = await Promise.all([
        chapterApi.getAllChapter(),
        levelApi.getAllLevel(),
        kanjiApi.getAllKanji(),
        vocabApi.getAllVocab(),
        renshuuCApi.getAllRenshuuC()
      ]);
      setChapters(ch.data.data);
      setLevels(lvl.data);
      setKanjis(kj.data);
      setVocabularies(vb.data);
      setRenshuuCList(rc.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Dialogue Logic ---
  const addDialogueLine = () => {
    const lastSpeaker = form.dialogue[form.dialogue.length - 1]?.speaker;
    const nextSpeaker = lastSpeaker === "A" ? "B" : "A"; // Auto-alternate speaker
    setForm({ 
      ...form, 
      dialogue: [...form.dialogue, { speaker: nextSpeaker, sentence: "", meaning: "" }] 
    });
  };

  const updateDialogue = (idx, key, val) => {
    const newDialogue = [...form.dialogue];
    newDialogue[idx][key] = val;
    setForm({ ...form, dialogue: newDialogue });
  };

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
        await renshuuCApi.updateRenshuuC(editItem._id, payload);
      } else {
        await renshuuCApi.createRenshuuC(payload);
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
      title: item.title || "",
      scenario: item.scenario || "",
      dialogue: item.dialogue || [],
      level: item.level?._id || item.level || "",
      chapter: item.chapter?._id || item.chapter || "",
      relatedKanji: item.relatedKanji || [],
      relatedVocab: item.relatedVocab || [],
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await renshuuCApi.deleteRenshuuC(deleteId);
      setShowDeleteModal(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const filteredData = renshuuCList.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.chapter?.index?.toString().includes(search)
  );

  if (loading && renshuuCList.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      <Stack direction="row" spacing={2} sx={{ py: 2 }} alignItems="center">
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => {
            setEditItem(null);
            setForm({ title: "", scenario: "", dialogue: [{ speaker: "A", sentence: "", meaning: "" }], level: "", chapter: "", relatedKanji: [], relatedVocab: [] });
            setShowModal(true);
          }}
          sx={{ borderRadius: 4 }}
        >
          Add Renshuu C
        </Button>
        {showSearch && (
          <TextField
            autoFocus fullWidth size="small" placeholder="Search Title or Chapter..."
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
              {editItem ? `Edit Dialogue: ${editItem.title}` : "New Renshuu C Dialogue"}
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

            <TextField label="Dialogue Title" fullWidth value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <TextField label="Scenario Description" multiline rows={2} fullWidth value={form.scenario} onChange={(e) => setForm({...form, scenario: e.target.value})} />

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RecordVoiceOver /> Conversation Lines
            </Typography>

            {form.dialogue.map((line, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 2, position: 'relative', borderLeft: `5px solid ${line.speaker === 'A' ? theme.palette.primary.main : theme.palette.secondary.main}` }}>
                <IconButton 
                  size="small" color="error" 
                  sx={{ position: 'absolute', top: 5, right: 5 }}
                  onClick={() => setForm({...form, dialogue: form.dialogue.filter((_, i) => i !== idx)})}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField label="Speaker" size="small" sx={{ width: 100 }} value={line.speaker} onChange={(e) => updateDialogue(idx, "speaker", e.target.value)} />
                    <TextField label="Japanese Sentence" size="small" fullWidth value={line.sentence} onChange={(e) => updateDialogue(idx, "sentence", e.target.value)} />
                  </Stack>
                  <TextField label="Meaning" size="small" fullWidth value={line.meaning} onChange={(e) => updateDialogue(idx, "meaning", e.target.value)} />
                </Stack>
              </Paper>
            ))}
            <Button startIcon={<Add />} variant="outlined" onClick={addDialogueLine}>Add Dialogue Line</Button>

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
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 3, mt: 2 }}>
        {filteredData.map((item) => (
          <Card key={item._id} sx={{ borderRadius: 5 }}>
            <Box sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.8), p: 2, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Practice C</Typography>
              <Typography variant="caption">Ch {item.chapter?.index}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Forum fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">{item.dialogue?.length} lines in conversation</Typography>
              </Stack>
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
          <Typography variant="h6">Delete Dialogue?</Typography>
          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
            <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default RenshuuC;