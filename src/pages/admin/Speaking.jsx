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
import { Close, Delete, Edit, Add, Headset, Person, Message, Warning } from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { chapterApi } from "../../api/chapterApi";
import { levelApi } from "../../api/levelApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { grammarApi } from "../../api/grammarApi";
import { speakingApi } from "../../api/speakingApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Speaking = () => {
  const theme = useTheme();
  
  // Data States
  const [chapters, setChapters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [speakingList, setSpeakingList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal/UI States
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const initialForm = {
    level: "",
    chapter: "",
    title: "会話",
    description: "",
    audioUrl: "",
    lines: [{ orderIndex: 0, speaker: { nameJa: "", nameMm: "" }, textJa: "", textMn: "", audioUrl: "" }],
    relatedKanji: [],
    relatedGrammar: [],
    relatedVocabulary: [],
  };

  const [form, setForm] = useState(initialForm);

  // Hotkeys & Initial Load
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
      const [ch, lvl, kj, vb, gm, sk] = await Promise.all([
        chapterApi.getAllChapter(),
        levelApi.getAllLevel(),
        kanjiApi.getAllKanji(),
        vocabApi.getAllVocab(),
        grammarApi.getAllGrammar(),
        speakingApi.getAllSpeaking()
      ]);
      setChapters(ch.data.data);
      setLevels(lvl.data);
      setKanjis(kj.data);
      setVocabularies(vb.data);
      setGrammars(gm.data.data);
      setSpeakingList(sk.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Line Management ---
  const addLine = () => {
    setForm(prev => ({ 
      ...prev, 
      lines: [...prev.lines, { 
        orderIndex: prev.lines.length, 
        speaker: { nameJa: "", nameMm: "" }, 
        textJa: "", textMn: "", audioUrl: "" 
      }] 
    }));
  };

  const updateLine = (idx, field, value, isSpeakerField = false) => {
    const newLines = [...form.lines];
    if (isSpeakerField) {
      newLines[idx].speaker = { ...newLines[idx].speaker, [field]: value };
    } else {
      newLines[idx][field] = value;
    }
    setForm({ ...form, lines: newLines });
  };

  // --- CRUD Operations ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        relatedKanji: form.relatedKanji.map(k => k._id || k),
        relatedGrammar: form.relatedGrammar.map(g => g._id || g),
        relatedVocabulary: form.relatedVocabulary.map(v => v._id || v)
      };

      if (editItem) {
        await speakingApi.updateSpeaking(editItem._id, payload);
      } else {
        await speakingApi.createSpeaking(payload);
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
      level: item.level?._id || item.level,
      chapter: item.chapter?._id || item.chapter,
      title: item.title,
      description: item.description || "",
      audioUrl: item.audioUrl || "",
      lines: item.lines || [],
      relatedKanji: item.relatedKanji || [],
      relatedGrammar: item.relatedGrammar || [],
      relatedVocabulary: item.relatedVocabulary || [],
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await speakingApi.deleteSpeaking(deleteId);
      setShowDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const filteredList = speakingList.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.chapter?.index?.toString().includes(search)
  );

  if (loading && speakingList.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/* Toolbar */}
      <Stack direction="row" spacing={2} sx={{ py: 2 }} alignItems="center">
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => { setEditItem(null); setForm(initialForm); setShowModal(true); }}
          sx={{ borderRadius: 4 }}
        >
          Add Kaiwa
        </Button>
        {showSearch && (
          <TextField
            autoFocus fullWidth size="small" placeholder="Search Kaiwa Title or Chapter..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
          />
        )}
      </Stack>

      {/* Entry Dialog */}
      <Dialog fullScreen open={showModal} onClose={() => setShowModal(false)} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }} elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setShowModal(false)}><Close /></IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {editItem ? `Edit: ${editItem.title}` : "New Speaking Entry"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>Save Content</Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', width: '100%' }}>
          <Stack spacing={3}>
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

            <TextField label="Conversation Title" fullWidth value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <TextField label="Description / Scenario" multiline rows={2} fullWidth value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            <TextField label="Global Audio URL" fullWidth value={form.audioUrl} onChange={(e) => setForm({...form, audioUrl: e.target.value})} />

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Message color="primary" /> Conversation Script
            </Typography>

            {form.lines.map((line, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 3, mb: 2, bgcolor: 'background.default', position: 'relative' }}>
                <IconButton 
                  size="small" color="error" 
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                  onClick={() => setForm({...form, lines: form.lines.filter((_, i) => i !== idx)})}
                >
                  <Delete />
                </IconButton>
                
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Speaker (Ja)" size="small" value={line.speaker.nameJa} onChange={(e) => updateLine(idx, "nameJa", e.target.value, true)} />
                    <TextField label="Speaker (Translation)" size="small" value={line.speaker.nameMm} onChange={(e) => updateLine(idx, "nameMm", e.target.value, true)} />
                    <TextField label="Line Audio URL" size="small" fullWidth value={line.audioUrl} onChange={(e) => updateLine(idx, "audioUrl", e.target.value)} />
                  </Stack>
                  <TextField label="Japanese Sentence" multiline fullWidth value={line.textJa} onChange={(e) => updateLine(idx, "textJa", e.target.value)} />
                  <TextField label="Myanmar/English Translation" multiline fullWidth value={line.textMn} onChange={(e) => updateLine(idx, "textMn", e.target.value)} />
                </Stack>
              </Paper>
            ))}
            <Button startIcon={<Add />} variant="outlined" onClick={addLine} sx={{ mb: 4 }}>Add Speech Line</Button>

            <Divider>Related References</Divider>

            <Autocomplete
              multiple options={kanjis} getOptionLabel={(o) => o.character}
              value={form.relatedKanji} onChange={(_, v) => setForm({...form, relatedKanji: v})}
              renderInput={(p) => <TextField {...p} label="Related Kanji" />}
            />

            <Autocomplete
              multiple options={grammars} getOptionLabel={(o) => o.pattern}
              value={form.relatedGrammar} onChange={(_, v) => setForm({...form, relatedGrammar: v})}
              renderInput={(p) => <TextField {...p} label="Related Grammar Patterns" />}
            />

            <Autocomplete
              multiple options={vocabularies} getOptionLabel={(o) => o.word}
              value={form.relatedVocabulary} onChange={(_, v) => setForm({...form, relatedVocabulary: v})}
              renderInput={(p) => <TextField {...p} label="Related Vocabulary" />}
            />
          </Stack>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Warning color="error" sx={{ fontSize: 40 }} />
          <Typography variant="h6">Delete Kaiwa?</Typography>
          <Typography variant="body2" color="text.secondary">This will remove all dialogue lines and audio references.</Typography>
          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
            <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Confirm Delete</Button>
          </Stack>
        </Box>
      </Dialog>

      {/* Main Grid Display */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 3, mt: 2 }}>
        {filteredList.map((item) => (
          <Card key={item._id} sx={{ borderRadius: 5, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.9), p: 2, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                <Typography variant="caption">{item.level?.code} • Chapter {item.chapter?.index}</Typography>
              </Box>
              <Headset />
            </Box>
            <Box sx={{ p: 2, height: 80 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {item.description?.substring(0, 80)}...
              </Typography>
              <Typography variant="caption" color="primary" display="block" sx={{ mt: 1 }}>
                {item.lines?.length} Dialogue Lines
              </Typography>
            </Box>
            <CardActions sx={{ justifyContent: 'flex-end', bgcolor: 'grey.50' }}>
              <IconButton color="primary" onClick={() => handleEdit(item)}><Edit fontSize="small" /></IconButton>
              <IconButton color="error" onClick={() => { setDeleteId(item._id); setShowDeleteModal(true); }}><Delete fontSize="small" /></IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Speaking;