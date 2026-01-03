import React, { forwardRef, useEffect, useState } from "react";
import LoadingComponent from "../LoadingComponent";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import {
  AppBar,
  Box,
  Button,
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
import { Close } from "@mui/icons-material";
import { EXAM_TYPES } from "../../constants/exam";
import { moduleApi } from "../../api/moduleApi";
import { levelApi } from "../../api/levelApi";
import { examApi } from "../../api/examApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExamComponent = ({ action, toggle }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "",
    level: "",
    module: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await examApi.createExam(form);
      toggle((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <Dialog
      component="form"
      onSubmit={handleSubmit}
      open={action}
      onClose={toggle}
      slots={{ transition: Transition }}
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
            {translations[language]?.addExam || "Add Exam"}
          </Typography>
          <Button type="submit" color="inherit">
            {translations[language]?.save || "Save"}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
        <TextField
          label={translations[language]?.title || "Title"}
          required
          fullWidth
          size="small"
          margin="normal"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <FormControl fullWidth size="small" margin="normal">
          <InputLabel>Exam Type</InputLabel>
          <Select
            value={form.type}
            required
            label="Exam Type"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {Object.keys(EXAM_TYPES).map((key) => (
              <MenuItem key={key} value={EXAM_TYPES[key]}>
                {EXAM_TYPES[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" margin="normal">
          <InputLabel>Exam Level</InputLabel>
          <Select
            value={form.level}
            required
            label="Level"
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            {levels.map((lvl) => (
              <MenuItem key={lvl._id} value={lvl._id}>
                {lvl.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" margin="normal">
          <InputLabel>Module</InputLabel>
          <Select
            value={form.module}
            required
            label="Module"
            onChange={(e) => setForm({ ...form, module: e.target.value })}
          >
            {modules.map((mod) => (
              <MenuItem key={mod._id} value={mod._id}>
                {mod.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Dialog>
  );
};

export default ExamComponent;
