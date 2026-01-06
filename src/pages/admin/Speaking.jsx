import {
  AppBar,
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import TitleComponent from "../../components/TitleComponent";
import React, { forwardRef, useEffect, useState } from "react";
import { levelApi } from "../../api/levelApi";
import LoadingComponent from "../../components/LoadingComponent";
import { Close, Delete, Edit } from "@mui/icons-material";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { kanjiApi } from "../../api/kanjiApi";
import { speakingApi } from "../../api/speakingApi";
import { vocabApi } from "../../api/vocabApi";
import { grammarApi } from "../../api/grammarApi.js";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const emptyLine = (order) => ({
  orderIndex: order,
  speaker: { nameJa: "", nameMm: "" },
  textJa: "",
  textMn: "",
  audioUrl: "",
});

const Speaking = () => {
  const { language } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabs, setVocabs] = useState([]);
  const [speakings, setSpeakings] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSpeaking, setEditSpeaking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSpeakingId, setDeleteSpeakingId] = useState(false);

  const [form, setForm] = useState({
    level: "",
    title: "会話",
    description: "",
    relatedKanji: [],
    relatedVocabulary: [],
    relatedGrammar: [],
    lines: [emptyLine(1)],
  });

  const fetchSpeakings = async () => {
    try {
      const res = await speakingApi.getAllSpeaking();
      setSpeakings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    levelApi.getAllLevel().then((r) => setLevels(r.data));
    kanjiApi.getAllKanji().then((r) => setKanjis(r.data));
    vocabApi.getAllVocab().then((r) => setVocabs(r.data));
    grammarApi.getAllGrammar().then((r) => setGrammars(r.data));
  }, []);

  const updateSpeaker = (index, field, value) => {
    const lines = [...form.lines];
    lines[index].speaker[field] = value;
    setForm({ ...form, lines });
  };

  const updateLine = (index, field, value) => {
    const lines = [...form.lines];
    lines[index][field] = value;

    const isLast = index === lines.length - 1;
    const hasContent = lines[index].textJa.trim() || lines[index].textMn.trim();

    // auto append next line
    if (isLast && hasContent) {
      lines.push(emptyLine(lines.length + 1));
    }

    setForm({ ...form, lines });
  };

  // Handle Edit
  const handleEdit = (kanji) => {
    setForm({
      level: "",
      title: "会話",
      description: "",
      relatedKanji: [],
      relatedVocabulary: [],
      relatedGrammar: [],
      lines: [emptyLine(1)],
    });
    setEditSpeaking(kanji);
    setShowModal(true);
  };

  // Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedLines = form.lines
      .filter((l) => l.textJa.trim() && l.textMn.trim())
      .map((l, i) => ({ ...l, orderIndex: i + 1 }));

    if (cleanedLines.length === 0) {
      setLoading(false);
      return;
    }

    const payload = {
      level: form.level,
      title: form.title,
      description: form.description,
      lines: cleanedLines,
      relatedKanji: form.relatedKanji.map((k) => k._id),
      relatedVocabulary: form.relatedVocabulary.map((v) => v._id),
    };

    try {
      await speakingApi.updateSpeaking(editSpeaking._id, payload);
      fetchSpeakings();
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteSpeakingId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteSpeakingId) {
      await speakingApi.deleteSpeaking(deleteSpeakingId);
      setShowDeleteModal(false);
      setDeleteSpeakingId(null);
      fetchSpeakings();
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Box>
      <TitleComponent />

      {showModal && (
        <React.Fragment>
          <Dialog
            component={"form"}
            onSubmit={handleSubmit}
            open={showModal}
            onClose={() => setShowModal(false)}
            slots={{
              transition: Transition,
            }}
          >
            <AppBar elevation={0} sx={{ position: "sticky" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setShowModal(false)}
                >
                  <Close />
                </IconButton>
                <Typography sx={{ flex: 1 }} variant="h6">
                  Add Data
                </Typography>
                <Button type="submit" color="inherit">
                  Save
                </Button>
              </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
              {/* BASIC INFO */}
              <TextField
                label="Title"
                fullWidth
                size="small"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <TextField
                label="Description"
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  label="Level"
                  value={form.level}
                  required
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  {levels.map((l) => (
                    <MenuItem key={l._id} value={l._id}>
                      {l.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* KAIWA LINES */}
              <Typography variant="h6" sx={{ mt: 4 }}>
                Dialogue
              </Typography>

              {form.lines.map((line, i) => (
                <Stack key={i} spacing={1} sx={{ mt: 2 }}>
                  <TextField
                    label="Speaker (JP)"
                    size="small"
                    value={line.speaker.nameJa}
                    onChange={(e) => updateSpeaker(i, "nameJa", e.target.value)}
                  />
                  <TextField
                    label="Speaker (MM)"
                    size="small"
                    value={line.speaker.nameMm}
                    onChange={(e) => updateSpeaker(i, "nameMm", e.target.value)}
                  />
                  <TextField
                    label="Japanese"
                    size="small"
                    value={line.textJa}
                    onChange={(e) => updateLine(i, "textJa", e.target.value)}
                  />
                  <TextField
                    label="Myanmar"
                    size="small"
                    value={line.textMn}
                    onChange={(e) => updateLine(i, "textMn", e.target.value)}
                  />
                </Stack>
              ))}

              {/* RELATIONS */}
              <Autocomplete
                multiple
                sx={{ mt: 4 }}
                options={kanjis}
                value={form.relatedKanji}
                getOptionLabel={(o) => o.character}
                onChange={(e, v) => setForm({ ...form, relatedKanji: v })}
                renderInput={(params) => (
                  <TextField {...params} label="Related Kanji" />
                )}
              />

              <Autocomplete
                multiple
                sx={{ mt: 2 }}
                options={vocabs}
                value={form.relatedVocabulary}
                getOptionLabel={(o) => o.word}
                onChange={(e, v) => setForm({ ...form, relatedVocabulary: v })}
                renderInput={(params) => (
                  <TextField {...params} label="Related Vocabulary" />
                )}
              />

              <Autocomplete
                multiple
                sx={{ mt: 2 }}
                options={grammars}
                value={form.relatedGrammar}
                getOptionLabel={(o) => o.structure}
                onChange={(e, v) => setForm({ ...form, relatedGrammar: v })}
                renderInput={(params) => (
                  <TextField {...params} label="Related Grammar" />
                )}
              />
            </Box>
          </Dialog>
        </React.Fragment>
      )}

      {showDeleteModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            animation: "fadeIn 0.3s",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              {translations[language].caution || "Caution"}
            </Typography>
            <Typography mb={3}>
              {translations[language].delete_confirm ||
                "Are you sure want to delete?"}
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setShowDeleteModal(false)}
              >
                {translations[language].cancel || "Cancel"}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                {translations[language].delete || "Delete"}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Data */}
      <Box sx={{ my: 3 }}></Box>
    </Box>
  );
};

export default Speaking;
