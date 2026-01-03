import React, { forwardRef, useEffect, useState } from "react";
import { lessonApi } from "../../api/lessonApi";
import LoadingComponent from "../LoadingComponent";
import { kanjiApi } from "../../api/kanjiApi";
import { moduleApi } from "../../api/moduleApi";
import { levelApi } from "../../api/levelApi";
import { vocabApi } from "../../api/vocabApi";
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
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { CheckBox, Close, Square } from "@mui/icons-material";
import { grammarApi } from "../../api/grammarApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LessonComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [modules, setModules] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    level: "",
    module: "",
    grammarPatterns: [],
    kanji: [],
    vocabulary: [],
    examples: [],
    contentBlocks: null,
  });

  // Fetch Levels, Modules, Kanjis, Vocabularies
  const fetchGrammar = async () => {
    setLoading(true);
    try {
      const res = await grammarApi.getAllGrammar();
      setGrammars(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGrammar();
  }, []);

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

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await moduleApi.getAllModules();
      setModules(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const res = await levelApi.getAllLevel();
      setLevels(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchVocabularies = async () => {
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
    fetchVocabularies();
  }, []);

  // Handle Submit
  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      ...form,
      grammarPatterns:
        form.grammarPatterns !== form.grammarPatterns
          ? form.grammarPatterns.split(",")
          : form.grammarPatterns,
      kanji: form.kanji !== form.kanji ? form.kanji.split(",") : form.kanji,
      vocabulary:
        form.vocabulary !== form.vocabulary
          ? form.vocabulary.split(",")
          : form.vocabulary,
    };
    try {
      await lessonApi.createLesson(formData);
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
          <FormControl fullWidth size="small" margin="normal">
            <InputLabel htmlFor="level">Module</InputLabel>
            <Select
              labelId="module-label"
              label="Module"
              value={form.module}
              required
              onChange={(e) => setForm({ ...form, module: e.target.value })}
            >
              {modules.map((module) => (
                <MenuItem key={module._id} value={module._id}>
                  {module.key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              multiple
              size="small"
              options={grammars}
              disableCloseOnSelect
              value={form.grammarPatterns}
              onChange={(event, newValue) => {
                setForm({ ...form, grammarPatterns: newValue });
              }}
              getOptionLabel={(option) => option.title}
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
                    {option.title}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Grammar Patterns"
                  placeholder={
                    form.grammarPatterns.length === 0
                      ? "Search Grammar ..."
                      : ""
                  }
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              multiple
              size="small"
              options={kanjis}
              disableCloseOnSelect
              value={form.kanji}
              onChange={(event, newValue) => {
                setForm({ ...form, kanji: newValue });
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
                  modules
                  label="Add Kanji"
                  placeholder={
                    form.kanji.length === 0 ? "Search Kanji ..." : ""
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
              value={form.vocabulary}
              onChange={(event, newValue) => {
                setForm({ ...form, vocabulary: newValue });
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
                  label="Add Vocabulary"
                  placeholder={
                    form.vocabulary.length === 0 ? "Search Vocabulary ..." : ""
                  }
                />
              )}
            />
          </FormControl>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default LessonComponent;
