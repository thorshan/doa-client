import { CheckBox, Close, Square } from "@mui/icons-material";
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
import React, { forwardRef, useEffect, useState } from "react";
import { levelApi } from "../../api/levelApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import LoadingComponent from "../LoadingComponent";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VocabComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [form, setForm] = useState({
    word: "",
    reading: "",
    meaning: "",
    kanji: [],
    level: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      ...form,
      kanji: form.kanji !== form.kanji ? form.kanji.split(",") : form.kanji,
    };
    try {
      await vocabApi.createVocab(formData);
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
            label="Word"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.word}
            onChange={(e) => setForm({ ...form, word: e.target.value })}
          />
          <TextField
            label="Reading"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.reading}
            onChange={(e) => setForm({ ...form, reading: e.target.value })}
          />
          <TextField
            label="Meaning"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.meaning}
            onChange={(e) => setForm({ ...form, meaning: e.target.value })}
          />
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
                  label="Add Kanji"
                  placeholder={
                    form.kanji.length === 0 ? "Search Kanji ..." : ""
                  }
                />
              )}
            />
          </FormControl>
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
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default VocabComponent;
