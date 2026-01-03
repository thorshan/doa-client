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
import TitleComponent from "../../components/TitleComponent";
import { levelApi } from "../../api/levelApi";
import { kanjiApi } from "../../api/kanjiApi";
import { useLanguage } from "../../context/LanguageContext";
import { grammarApi } from "../../api/grammarApi";
import { Close, Delete, Edit, Square, CheckBox } from "@mui/icons-material";
import { translations } from "../../constants/translations";
import RenderFurigana from "../../components/RenderFurigana";
import LoadingComponent from "../../components/LoadingComponent";
import { vocabApi } from "../../api/vocabApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Grammar = () => {
  const theme = useTheme();
  const { language } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editGrammar, setEditGrammar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGrammarId, setDeleteGrammarId] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
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

  const wordToFind = [
    "あの",
    "この",
    "これ",
    "は",
    "が",
    "を",
    "に",
    "です",
    "と",
    "も",
    "から",
    "まで",
    "より",
    "で",
    "ですか",
    "ません",
    "の",
    "それ",
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detects Cmd + K (Mac) or Ctrl + K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); // Prevent browser default behavior
        setShowSearch((prev) => !prev);
      }

      // Close on Escape
      if (event.key === "Escape") {
        setShowSearch(false);
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Fetch Grammar
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

  // Handle Edit
  const handleEdit = (grammar) => {
    setForm({
      title: grammar.title || "",
      structure: grammar.structure || "",
      level: grammar.level?._id || grammar.level || "",
      meaning: grammar.meaning || "",
      explanation: grammar.explanation || "",
      examples: grammar.examples || [],
      relatedKanji: grammar.relatedKanji?._id || grammar.relatedKanji || [],
      relatedVocabulary:
        grammar.relatedVocabulary?._id || grammar.relatedVocabulary || [],
      tags: grammar.tags || [],
    });
    setEditGrammar(grammar);
    setShowModal(true);
  };

  // Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setLoading(true);
    try {
      await grammarApi.updateGrammar(editGrammar._id, formData);
      fetchGrammar();
    } catch (error) {
      console.error(error.message);
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteGrammarId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteGrammarId) {
      await grammarApi.deleteGrammar(deleteGrammarId);
      setShowDeleteModal(false);
      setDeleteGrammarId(null);
      fetchGrammar();
    }
  };

  // Filter Search
  const filteredGrammars = grammars.filter(
    (grammar) =>
      grammar.title.toLowerCase().includes(search.toLowerCase()) ||
      grammar.level?.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/* Search Bar */}
      <Box sx={{ py: 2 }}>
        {showSearch && (
          <FormControl fullWidth>
            <TextField
              color="primary"
              placeholder="Search"
              fullWidth
              autoFocus
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 5,
                },
              }}
              onKeyDownCapture={(e) => e.key === "Escape" && setSearch("")}
            />
          </FormControl>
        )}
      </Box>

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
                onChange={(e) =>
                  setForm({ ...form, structure: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
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
                      label="Add Kanji"
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

      {/* Grammar Data */}
      <Box sx={{ my: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 2,
          }}
        >
          {filteredGrammars.length > 0 ? (
            filteredGrammars.map((grammar, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 5,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "white" }}>
                    {grammar.title}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, px: 2 }}>
                  <Box sx={{ my: 1 }}>
                    <Typography variant="body1">
                      {grammar.structure
                        .split(new RegExp(`(${wordToFind.join("|")})`, "gi"))
                        .map((part, index) =>
                          wordToFind.includes(part) ? (
                            <Box
                              component="span"
                              key={index}
                              sx={{ color: "primary.main", fontWeight: "bold" }}
                            >
                              {part}
                            </Box>
                          ) : (
                            part
                          )
                        )}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    <RenderFurigana
                      text={grammar.explanation}
                      relatedKanji={grammar.relatedKanji}
                    />
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption">{grammar.meaning}</Typography>
                  </Box>
                </Box>
                <CardActions
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(grammar)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteModal(grammar._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </CardActions>
              </Card>
            ))
          ) : (
            <Card
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 5,
                p: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">No data found.</Typography>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Grammar;
