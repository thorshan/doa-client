import { Close } from "@mui/icons-material";
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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const KanjiComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);

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

  const [form, setForm] = useState({
    character: "",
    onyomi: [],
    kunyomi: [],
    meaning: [],
    strokes: "",
    level: "",
    examples: [],
  });

  //
  const addExample = () => {
    setForm({
      ...form,
      examples: [...form.examples, { word: "", reading: "", meaning: "" }],
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

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      ...form,
      onyomi: form.onyomi.split(","),
      kunyomi: form.kunyomi.split(","),
      meaning: form.meaning.split(","),
    };
    try {
      await kanjiApi.createKanji(formData);
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
            label="Character"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.character}
            onChange={(e) => setForm({ ...form, character: e.target.value })}
          />
          <TextField
            label="Onyomi"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.onyomi}
            onChange={(e) => setForm({ ...form, onyomi: e.target.value })}
          />
          <TextField
            label="Kunyomi"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.kunyomi}
            onChange={(e) => setForm({ ...form, kunyomi: e.target.value })}
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
          <TextField
            type="number"
            label="Strokes"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.strokes}
            onChange={(e) => setForm({ ...form, strokes: e.target.value })}
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
                label="Word"
                value={g.word}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "word", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Reading"
                value={g.reading}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "reading", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Meaning"
                value={g.meaning}
                size="small"
                onChange={(e) =>
                  updateExampleField(idx, "meaning", e.target.value)
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

export default KanjiComponent;
