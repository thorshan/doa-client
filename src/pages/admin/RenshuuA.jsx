import {
  alpha,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
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
import { Close, Delete, Edit, Add, Warning } from "@mui/icons-material";
import TitleComponent from "../../components/TitleComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { chapterApi } from "../../api/chapterApi";
import { kanjiApi } from "../../api/kanjiApi";
import { vocabApi } from "../../api/vocabApi";
import { renshuuAApi } from "../../api/renshuuAApi";
import { useLanguage } from "../../context/LanguageContext";
import { levelApi } from "../../api/levelApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RenshuuA = () => {
  const theme = useTheme();
  const { language } = useLanguage();

  // Data States
  const [chapters, setChapters] = useState([]);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [renshuuAList, setRenshuuAList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal/UI States
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Search States
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [form, setForm] = useState({
    patterns: [{ structure: "", meaning: "" }],
    chapter: "",
    level: "",
    relatedKanji: [],
    relatedVocab: [],
  });

  // Hotkey & Initial Load
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
    fetchData();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ch, kj, vb, lvl, ra] = await Promise.all([
        chapterApi.getAllChapter(),
        kanjiApi.getAllKanji(),
        vocabApi.getAllVocab(),
        levelApi.getAllLevel(),
        renshuuAApi.getAllRenshuuA(),
      ]);
      setChapters(ch.data.data);
      setLevels(lvl.data);
      setKanjis(kj.data);
      setVocabularies(vb.data);
      setRenshuuAList(ra.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Pattern Logic ---
  const addPattern = () =>
    setForm({
      ...form,
      patterns: [...form.patterns, { structure: "", meaning: "" }],
    });

  const updatePattern = (idx, key, val) => {
    const newPatterns = [...form.patterns];
    newPatterns[idx][key] = val;
    setForm({ ...form, patterns: newPatterns });
  };

  // --- CRUD Operations ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        relatedKanji: form.relatedKanji.map((k) => k._id || k),
        relatedVocab: form.relatedVocab.map((v) => v._id || v),
      };

      if (editItem) {
        await renshuuAApi.updateRenshuuA(editItem._id, payload);
      } else {
        await renshuuAApi.createRenshuuA(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      patterns: item.patterns || [{ structure: "", meaning: "" }],
      chapter: item.chapter?._id || item.chapter || "",
      level: item.level?._id || item.level || "",
      relatedKanji: item.relatedKanji || [],
      relatedVocab: item.relatedVocab || [],
    });
    setShowModal(true);
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await renshuuAApi.deleteRenshuuA(deleteId);
      setShowDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = renshuuAList.filter(
    (item) =>
      item.chapter?.index?.toString().includes(search) ||
      item.patterns.some((p) =>
        p.structure.toLowerCase().includes(search.toLowerCase())
      )
  );

  if (loading && renshuuAList.length === 0) return <LoadingComponent />;

  return (
    <Box>
      <TitleComponent />

      {/* Search & Add Bar */}
      <Stack direction="row" spacing={2} sx={{ py: 2 }} alignItems="center">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditItem(null);
            setForm({
              patterns: [{ structure: "", meaning: "" }],
              chapter: "",
              relatedKanji: [],
              relatedVocab: [],
            });
            setShowModal(true);
          }}
          sx={{ borderRadius: 4 }}
        >
          Add Renshuu A
        </Button>
        {showSearch && (
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Search Structure or Chapter Index (Ctrl+K)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 5 } }}
          />
        )}
      </Stack>

      {/* Main Create/Edit Dialog */}
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
              {editItem
                ? `Edit Chapter ${editItem.chapter?.index}`
                : "New Renshuu A"}
            </Typography>
            <Button color="inherit" onClick={handleSubmit}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 850, mx: "auto", width: "100%" }}>
          <Stack spacing={4}>
            <FormControl fullWidth>
              <InputLabel>Target Chapter</InputLabel>
              <Select
                value={form.chapter}
                label="Target Chapter"
                onChange={(e) => setForm({ ...form, chapter: e.target.value })}
              >
                {chapters.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    Chapter {c.index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <Box>
              <Typography variant="h6" gutterBottom>
                Grammar Patterns & Structures
              </Typography>
              {form.patterns.map((p, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, bgcolor: "background.paper" }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <TextField
                      label="Structure (Japanese)"
                      size="small"
                      fullWidth
                      multiline
                      value={p.structure}
                      onChange={(e) =>
                        updatePattern(idx, "structure", e.target.value)
                      }
                    />
                    <TextField
                      label="Meaning / Usage"
                      size="small"
                      fullWidth
                      multiline
                      value={p.meaning}
                      onChange={(e) =>
                        updatePattern(idx, "meaning", e.target.value)
                      }
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        setForm({
                          ...form,
                          patterns: form.patterns.filter((_, i) => i !== idx),
                        })
                      }
                      disabled={form.patterns.length === 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
              <Button startIcon={<Add />} variant="text" onClick={addPattern}>
                Add Line
              </Button>
            </Box>

            <Autocomplete
              multiple
              options={kanjis}
              getOptionLabel={(o) => o.character}
              value={form.relatedKanji}
              onChange={(_, v) => setForm({ ...form, relatedKanji: v })}
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Related Kanji"
                  placeholder="Search Kanji..."
                />
              )}
            />

            <Autocomplete
              multiple
              options={vocabularies}
              getOptionLabel={(o) => o.word}
              value={form.relatedVocab}
              onChange={(_, v) => setForm({ ...form, relatedVocab: v })}
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Related Vocabulary"
                  placeholder="Search Words..."
                />
              )}
            />
          </Stack>
        </Box>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ p: 3, textAlign: "center", maxWidth: 400 }}>
          <Warning color="error" sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="h6">Delete Renshuu A?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This will permanently remove the grammar structures and meanings for
            this chapter entry.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Dialog>

      {/* Grid List View */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 3,
          mt: 2,
        }}
      >
        {filteredData.map((item) => (
          <Card
            key={item._id}
            sx={{
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                p: 2,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2">Practice A</Typography>
              <Typography variant="subtitle2">
                Chapter {item.chapter?.index}
              </Typography>
            </Box>
            <Box sx={{ p: 2, height: 120, overflow: "hidden" }}>
              {item.patterns.slice(0, 3).map((p, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  display="block"
                  noWrap
                  sx={{ mb: 0.5 }}
                >
                  • <b>{p.structure}</b>: {p.meaning}
                </Typography>
              ))}
              {item.patterns.length > 3 && (
                <Typography variant="caption" color="primary">
                  +{item.patterns.length - 3} more lines...
                </Typography>
              )}
            </Box>
            <CardActions
              sx={{
                justifyContent: "flex-end",
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <IconButton color="primary" onClick={() => handleEdit(item)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => openDeleteConfirm(item._id)}
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

export default RenshuuA;
