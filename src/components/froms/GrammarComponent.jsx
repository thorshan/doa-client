import { Close, Square, CheckBox } from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { levelApi } from "../../api/levelApi";
import LoadingComponent from "../LoadingComponent";
import { kanjiApi } from "../../api/kanjiApi";
import { grammarApi } from "../../api/grammarApi";
import { vocabApi } from "../../api/vocabApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GrammarComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);

  // Fetch Levels
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await levelApi.getAllLevel();
        setLevels(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLevel();
  }, []);

  // Fetch Kanji
  const fetchKanji = async () => {
    setLoading(true);
    try {
      const res = await kanjiApi.getAllKanji();
      setKanjis(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchKanji();
  }, []);

  // Fetch Vocabulary
  const fetchVocabulary = async () => {
    setLoading(true);
    try {
      const res = await vocabApi.getAllVocab();
      setVocabularies(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVocabulary();
  }, []);

  const [form, setForm] = useState({
    title: "",
    structure: "",
    level: "",
    meaning: "",
    explanation: "",
    examples: [],
    relatedKanji: [],
    relatedVocabulary: [],
    tags: [],
  });

  //
  const addExample = () => {
    setForm({
      ...form,
      examples: [...form.examples, { jp1: "", jp2: "", mm1: "", mm2: "" }],
    });
  };

  //
  const removeExample = (index) => {
    const newExapmle = form.examples.filter((_, i) => i !== index);
    setForm({ ...form, examples: newExapmle });
  };

  //
  const updateExampleField = (index, key, value) => {
    const newExample = [...form.examples];
    newExample[index][key] = value;
    setForm({ ...form, examples: newExample });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      ...form,
      examples:
        form.examples !== form.examples
          ? form.examples.split(",")
          : form.examples,
      relatedKanji:
        form.relatedKanji !== form.relatedKanji
          ? form.relatedKanji.split(",")
          : form.relatedKanji,
      relatedVocabulary:
        form.relatedVocabulary !== form.relatedVocabulary
          ? form.relatedVocabulary.split(",")
          : form.relatedVocabulary,
    };
    try {
      await grammarApi.createGrammar(formData);
      toggle((prev) => !prev);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;
  return (
    <React.Fragment>
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
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggle}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add new data
            </Typography>
            <Button type="submit" color="inherit">
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
          <TextField
            label="Title"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Structure"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.structure}
            onChange={(e) => setForm({ ...form, structure: e.target.value })}
          />
          <TextField
            label="meaning"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.meaning}
            onChange={(e) => setForm({ ...form, meaning: e.target.value })}
          />
          <TextField
            label="Explanation"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          />
          <FormControl fullWidth size="small" margin="normal">
            <InputLabel htmlFor="level">Level</InputLabel>
            <Select
              labelId="level-label"
              label="Level"
              value={form.level}
              required
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              {levels.map((level) => (
                <MenuItem key={level._id} value={level._id}>
                  {level.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              multiple
              size="small"
              options={kanjis}
              disableCloseOnSelect
              value={form.relatedKanji}
              onChange={(event, newValue) => {
                setForm({ ...form, relatedKanji: newValue });
              }}
              getOptionLabel={(option) => option.character}
              renderOption={(props, option, { selected }) => {
                const { key, ...otherProps } = props;
                return (
                  <li key={key} {...otherProps}>
                    <Checkbox
                      icon={<Square size={20} />}
                      checkedIcon={<CheckBox size={20} />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.character}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Related Kanji"
                  placeholder={
                    form.relatedKanji.length === 0 ? "Search Kanji ..." : ""
                  }
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              multiple
              size="small"
              options={vocabularies}
              disableCloseOnSelect
              value={form.relatedVocabulary}
              onChange={(event, newValue) => {
                setForm({ ...form, relatedVocabulary: newValue });
              }}
              getOptionLabel={(option) => option.word}
              renderOption={(props, option, { selected }) => {
                const { key, ...otherProps } = props;
                return (
                  <li key={key} {...otherProps}>
                    <Checkbox
                      icon={<Square size={20} />}
                      checkedIcon={<CheckBox size={20} />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.word}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Related Vocabulary"
                  placeholder={
                    form.relatedVocabulary.length === 0
                      ? "Search Vocabulary ..."
                      : ""
                  }
                />
              )}
            />
          </FormControl>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Examples
          </Typography>
          {form.examples.map((g, idx) => (
            <Paper
              elevation={0}
              key={idx}
              sx={{
                mb: 1,
                "& .MuiPaper-root": { backgroundColor: "background.paper" },
              }}
            >
              <TextField
                fullWidth
                label="Japanese 1"
                value={g.jp1}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "jp1", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Japanese 2"
                value={g.jp2}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "jp2", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Myanmar 1"
                value={g.mm1}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "mm1", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Myanmar 2"
                value={g.mm2}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "mm2", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <Button
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => removeExample(idx)}
              >
                Remove
              </Button>
            </Paper>
          ))}

          <Button
            size="small"
            variant="outlined"
            onClick={addExample}
            sx={{ mb: 2 }}
          >
            Add Example
          </Button>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default GrammarComponent;
