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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Kanji = () => {
  const { language } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editKanji, setEditKanji] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKanjiId, setDeleteKanjiId] = useState(false);

  const [form, setForm] = useState({
    character: "",
    onyomi: [],
    kunyomi: [],
    meaning: [],
    strokes: "",
    level: "",
    examples: [],
  });

  // Fetch Levels
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

  // Handle Edit
  const handleEdit = (kanji) => {
    setForm({
      character: kanji.character || "",
      onyomi: kanji.onyomi || [],
      kunyomi: kanji.kunyomi || [],
      meaning: kanji.meaning || [],
      strokes: kanji.strokes || "",
      level: kanji.level?._id || kanji.level || "",
      examples: kanji.examples || [],
    });
    setEditKanji(kanji);
    setShowModal(true);
  };

  // Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      onyomi:
        form.onyomi !== form.onyomi ? form.onyomi.split(",") : form.onyomi,
      kunyomi:
        form.kunyomi !== form.kunyomi ? form.kunyomi.split(",") : form.kunyomi,
      meaning:
        form.meaning !== form.meaning ? form.meaning.split(",") : form.meaning,
    };
    setLoading(true);
    try {
      await kanjiApi.updateKanji(editKanji._id, formData);
      fetchKanji();
    } catch (error) {
      console.error(error.message);
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteKanjiId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteKanjiId) {
      await kanjiApi.deleteKanji(deleteKanjiId);
      setShowDeleteModal(false);
      setDeleteKanjiId(null);
      fetchKanji();
    }
  };

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
                  aria-label="close"
                >
                  <Close />
                </IconButton>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  {`Update ${editKanji.character}`}
                </Typography>
                <Button type="submit" color="inherit">
                  save
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
                onChange={(e) =>
                  setForm({ ...form, character: e.target.value })
                }
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

      {/* Kanji Data */}
      <Box sx={{ my: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Character</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Onyoni</TableCell>
              <TableCell>Kunyomi</TableCell>
              <TableCell>Meaning</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kanjis.length > 0 ? (
              kanjis.map((kanji, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{kanji.character}</TableCell>
                  <TableCell>
                    {kanji.level?.code ? kanji.level.code : "N/A"}
                  </TableCell>
                  <TableCell>{kanji.onyomi.join(" 、 ")}</TableCell>
                  <TableCell>{kanji.kunyomi.join(" 、 ")}</TableCell>
                  <TableCell>{kanji.meaning.join("၊ ")}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <IconButton onClick={() => handleEdit(kanji)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(kanji._id)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Kanji;
