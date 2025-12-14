import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { cardApi } from "../../api/cardApi";
import { DeleteRounded, ModeEditRounded } from "@mui/icons-material";
import { CATEGORY } from "../../constants/category";
import { LEVEL } from "../../constants/level";
import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../constants/translations";

const Card = () => {
  const { language } = useLanguage();
  const [cards, setCards] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    furigana: [],
    category: "",
    level: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  //
  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await cardApi.getAllCards();
      console.log(res.data);
      setCards(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAdd = () => {
    setFormData({
      title: "",
      content: "",
      furigana: [],
      category: "",
      level: "",
    });
    setEditingCard(null);
    setShowModel(true);
  };

  const handleEdit = (card) => {
    setFormData({
      ...card,
      title: card.title,
      content: card.originalContent,
      category: card.category,
      level: card.level,
    });
    setEditingCard(card);
    setShowModel(true);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCard) {
        await cardApi.updateCard(editingCard._id, formData);
        setMessage("Card updated successfully.");
      } else {
        await cardApi.createCard(formData);
        setMessage("Card created successfully.");
      }
      setShowModel(false);
      fetchCards();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setMessage("");
      setError(null);
    }
  };

  // Handle Delete
  const openDeleteModal = (id) => {
    setDeleteCardId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    if (deleteCardId) {
      try {
        await cardApi.deleteCard(deleteCardId);
        setMessage("User deleted successfully.");
        fetchCards();
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete user.";
        setMessage(msg);
      } finally {
        setShowDeleteModal(false);
        setDeleteCardId(null);
      }
    }
  };

  // Loading component
  if (loading)
    return (
      <Backdrop
        open={loading}
        sx={{
          color: "primary.loading",
          backgroundColor: "background.default",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Cards</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add new
        </Button>
      </Box>
      {showModel && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add new card
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                margin="normal"
              >
                {Object.keys(CATEGORY).map((key) => (
                  <MenuItem key={key} value={CATEGORY[key]}>
                    {translations[language][key]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Level"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                margin="normal"
              >
                {Object.values(LEVEL).map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => setShowModel(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {editingCard ? "Update" : "Add"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* */}
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
            zIndex: 1200,
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              textAlign: "center",
              animation: "slideDown 0.3s ease",
            }}
          >
            <Typography variant="h6" mb={2}>
              {translations[language].caution}
            </Typography>
            <Typography mb={3}>
              {translations[language].delete_confirm}
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={() => setShowDeleteModal(false)}
              >
                {translations[language].cancel}
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                {translations[language].delete}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((card, index) => (
              <TableRow key={card._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{card.title}</TableCell>
                <TableCell>{card.category}</TableCell>
                <TableCell>{card.level}</TableCell>
                <TableCell>
                  {new Date(card.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleEdit(card)}
                    >
                      <ModeEditRounded />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => openDeleteModal(card._id)}
                    >
                      <DeleteRounded />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Card;
