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
import React, { forwardRef, useEffect, useState } from "react";
import TitleComponent from "../../components/TitleComponent";
import { vocabApi } from "../../api/vocabApi";
import { CheckBox, Close, Delete, Edit, Square } from "@mui/icons-material";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { levelApi } from "../../api/levelApi";
import { kanjiApi } from "../../api/kanjiApi";
import LoadingComponent from "../../components/LoadingComponent";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Vocabulary = () => {
  const { language } = useLanguage();
  const [vocabs, setVocabs] = useState([]);
  const [levels, setLevels] = useState([]);
  const [kanjis, setKanjis] = useState([]);
  const [editVocab, setEditVocab] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVocabId, setDeleteVocabId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    word: "",
    reading: "",
    meaning: "",
    kanji: [],
    level: "",
  });

  // Fetch Vocab
  const fetchVocabs = async () => {
    try {
      const res = await vocabApi.getAllVocab();
      setVocabs(res.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchVocabs();
  }, []);

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

  // Handle Edit
  const handleEdit = (vocab) => {
    setForm({
      word: vocab.word,
      reading: vocab.reading,
      meaning: vocab.meaning,
      kanji: vocab.kanji || [],
      level: vocab.level?._id || "",
    });
    setEditVocab(vocab);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      ...form,
      kanji: form.kanji !== form.kanji ? form.kanji.split(",") : form.kanji,
    };
    try {
      await vocabApi.updateVocab(editVocab._id, formData);
      setShowModal(false);
      fetchVocabs();
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteVocabId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteVocabId) {
      await vocabApi.deleteVocab(deleteVocabId);
      setShowDeleteModal(false);
      setDeleteVocabId(null);
      fetchVocabs();
    }
  };

  if (loading) return <LoadingComponent />;

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
      <Box sx={{ my: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Word</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Kanji</TableCell>
              <TableCell>Meaning</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vocabs.length > 0 ? (
              vocabs.map((vocab, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{vocab.word}</TableCell>
                  <TableCell>
                    {vocab.level?.code ? vocab.level.code : "N/A"}
                  </TableCell>
                  <TableCell>
                    {vocab.kanji
                      ? vocab.kanji.map((k) => k.character).join(" 、 ")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{vocab.meaning.split(",").join("၊ ")}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <IconButton onClick={() => handleEdit(vocab)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(vocab._id)}>
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

export default Vocabulary;
