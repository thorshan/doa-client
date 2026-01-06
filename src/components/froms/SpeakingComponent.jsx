import React, { forwardRef, useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import LoadingComponent from "../LoadingComponent";
import { speakingApi } from "../../api/speakingApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { levelApi } from "../../api/levelApi";
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

const SpeakingComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabs, setVocabs] = useState([]);
  const [grammars, setGrammars] = useState([]);

  const [form, setForm] = useState({
    level: "",
    title: "会話",
    description: "",
    relatedKanji: [],
    relatedVocabulary: [],
    relatedGrammar: [],
    lines: [emptyLine(1)],
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    levelApi.getAllLevel().then((r) => setLevels(r.data));
    kanjiApi.getAllKanji().then((r) => setKanjis(r.data));
    vocabApi.getAllVocab().then((r) => setVocabs(r.data));
    grammarApi.getAllGrammar().then((r) => setGrammars(r.data));
  }, []);

  /* ================= LINE HANDLERS ================= */

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

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      await speakingApi.createSpeaking(payload);
      toggle(false);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  /* ================= UI ================= */

  return (
    <Dialog
      component={"form"}
      onSubmit={handleSubmit}
      open={action}
      onClose={toggle}
      slots={{
        transition: Transition,
      }}
    >
      <AppBar elevation={0} sx={{ position: "sticky" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggle}>
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
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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
  );
};

export default SpeakingComponent;
