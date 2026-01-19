import {
  alpha,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
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
  Square,
  CheckBox,
  Add,
} from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import RenderFurigana from "../../components/RenderFurigana";
import { levelApi } from "../../api/levelApi";
import { chapterApi } from "../../api/chapterApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { grammarApi } from "../../api/grammarApi";
import { useLanguage } from "../../context/LanguageContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Grammar = () => {
  const theme = useTheme();
  const { language } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editGrammar, setEditGrammar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGrammarId, setDeleteGrammarId] = useState(null);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Form state precisely matching your Mongoose Schema
  const [form, setForm] = useState({
    pattern: "",
    chapter: "",
    meaning: "",
    level: "",
    relatedKanji: [],
    relatedVocab: [],
    notes: [], // Array of strings
    examples: [], // Array of { structure, meaning }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearch("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    fetchBaseData();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchBaseData = async () => {
    setLoading(true);
    try {
      const [lvl, ch, kj, vb, gm] = await Promise.all([
        levelApi.getAllLevel(),
        chapterApi.getAllChapter(),
        kanjiApi.getAllKanji(),
        vocabApi.getAllVocab(),
        grammarApi.getAllGrammar(),
      ]);
      setLevels(lvl.data);
      setChapters(ch.data.data);
      setKanjis(kj.data);
      setVocabularies(vb.data);
      setGrammars(gm.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseData();
  }, []);

  // Logic for dynamic arrays (Examples & Notes)
  const addExample = () =>
    setForm({
      ...form,
      examples: [...form.examples, { structure: "", meaning: "" }],
    });
  const updateExample = (idx, key, val) => {
    const newEx = [...form.examples];
    newEx[idx][key] = val;
    setForm({ ...form, examples: newEx });
  };

  const addNote = () => setForm({ ...form, notes: [...form.notes, ""] });
  const updateNote = (idx, val) => {
    const newNotes = [...form.notes];
    newNotes[idx] = val;
    setForm({ ...form, notes: newNotes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        relatedKanji: form.relatedKanji.map((k) => k._id || k),
        relatedVocab: form.relatedVocab.map((v) => v._id || v),
      };

      if (editGrammar) {
        await grammarApi.updateGrammar(editGrammar._id, payload);
      } else {
        await grammarApi.createGrammar(payload);
      }
      setShowModal(false);
      fetchBaseData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (grammar) => {
    setEditGrammar(grammar);
    setForm({
      pattern: grammar.pattern || "",
      chapter: grammar.chapter?._id || grammar.chapter || "",
      meaning: grammar.meaning || "",
      level: grammar.level?._id || grammar.level || "",
      relatedKanji: grammar.relatedKanji || [],
      relatedVocab: grammar.relatedVocab || [],
      notes: grammar.notes || [],
      examples: grammar.examples || [],
    });
    setShowModal(true);
  };

  const filteredGrammars = grammars.filter(
    (g) =>
      g.pattern.toLowerCase().includes(search.toLowerCase()) ||
      g.chapter?.index?.toString().includes(search)
  );

  if (loading && grammars.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/* Search & Actions */}
      <Stack direction="row" spacing={2} sx={{ py: 2 }} alignItems="center">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditGrammar(null);
            setForm({
              pattern: "",
              chapter: "",
              meaning: "",
              level: "",
              relatedKanji: [],
              relatedVocab: [],
              notes: [],
              examples: [],
            });
            setShowModal(true);
          }}
          sx={{ borderRadius: 4 }}
        >
          Add Grammar
        </Button>
        {showSearch && (
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Search Pattern or Chapter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
          />
        )}
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
              {editGrammar ? "Edit Pattern" : "New Grammar Pattern"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 900, mx: "auto", width: "100%" }}>
          <Stack spacing={3}>
            <TextField
              label="Grammar Pattern"
              fullWidth
              value={form.pattern}
              onChange={(e) => setForm({ ...form, pattern: e.target.value })}
            />

            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={form.level}
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
                <InputLabel>Chapter</InputLabel>
                <Select
                  value={form.chapter}
                  label="Chapter"
                  onChange={(e) =>
                    setForm({ ...form, chapter: e.target.value })
                  }
                >
                  {chapters.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      Chapter {c.index}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Overall Meaning"
              fullWidth
              value={form.meaning}
              onChange={(e) => setForm({ ...form, meaning: e.target.value })}
            />

            <Autocomplete
              multiple
              options={kanjis}
              getOptionLabel={(o) => o.character}
              value={form.relatedKanji}
              onChange={(_, v) => setForm({ ...form, relatedKanji: v })}
              renderInput={(p) => <TextField {...p} label="Related Kanji" />}
            />

            <Autocomplete
              multiple
              options={vocabularies}
              getOptionLabel={(o) => o.word}
              value={form.relatedVocab}
              onChange={(_, v) => setForm({ ...form, relatedVocab: v })}
              renderInput={(p) => (
                <TextField {...p} label="Related Vocabulary" />
              )}
            />

            <Typography variant="h6">Examples (structure & meaning)</Typography>
            {form.examples.map((ex, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Example Structure"
                  size="small"
                  fullWidth
                  value={ex.structure}
                  onChange={(e) =>
                    updateExample(idx, "structure", e.target.value)
                  }
                />
                <TextField
                  label="Meaning"
                  size="small"
                  fullWidth
                  value={ex.meaning}
                  onChange={(e) =>
                    updateExample(idx, "meaning", e.target.value)
                  }
                />
                <IconButton
                  color="error"
                  onClick={() =>
                    setForm({
                      ...form,
                      examples: form.examples.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <Delete />
                </IconButton>
              </Paper>
            ))}
            <Button startIcon={<Add />} onClick={addExample}>
              Add Example
            </Button>

            <Typography variant="h6">Usage Notes</Typography>
            {form.notes.map((note, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <TextField
                  label={`Note ${idx + 1}`}
                  size="small"
                  fullWidth
                  value={note}
                  onChange={(e) => updateNote(idx, e.target.value)}
                />
                <IconButton
                  color="error"
                  onClick={() =>
                    setForm({
                      ...form,
                      notes: form.notes.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <Delete />
                </IconButton>
              </Stack>
            ))}
            <Button startIcon={<Add />} onClick={addNote}>
              Add Note
            </Button>
          </Stack>
        </Box>
      </Dialog>

      {/* Display Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 3,
          mt: 2,
        }}
      >
        {filteredGrammars.map((grammar) => (
          <Card key={grammar._id} sx={{ borderRadius: 5 }}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                p: 2,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1">{grammar.pattern}</Typography>
              <Typography variant="caption">
                Chapter {grammar.chapter?.index}
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body1"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {grammar.meaning}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Examples: {grammar.examples?.length || 0}
                </Typography>
              </Box>
            </Box>
            <CardActions
              sx={{ justifyContent: "flex-end", bgcolor: "grey.50" }}
            >
              <IconButton color="primary" onClick={() => handleEdit(grammar)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  setDeleteGrammarId(grammar._id);
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

export default Grammar;
