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
import { LEVEL_CATEGORY } from "../../constants/category";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Level = () => {
  const { language } = useLanguage();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLevel, setEditLevel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLevelId, setDeleteLevelId] = useState(false);

  const [form, setForm] = useState({
    code: "",
    order: "",
    title: "",
    description: "",
    category: "",
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

  // Handle Edit
  const handleEdit = (level) => {
    setForm({
      code: level.code || "",
      order: level.order || "",
      title: level.title || "",
      description: level.description || "",
      category: level.category || "",
    });
    setEditLevel(level);
    setShowModal(true);
  };

  // Handle Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await levelApi.updateLevel(editLevel._id, form);
      fetchLevels();
      setShowModal(false);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteLevelId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteLevelId) {
      await levelApi.deleteLevel(deleteLevelId);
      setShowDeleteModal(false);
      setDeleteLevelId(null);
      fetchLevels();
    }
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
            <AppBar elevation={0} sx={{ position: "relative" }}>
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
                  {`Update ${editLevel.code}`}
                </Typography>
                <Button type="submit" color="inherit">
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
              <TextField
                label="Code"
                color="primary"
                required
                fullWidth
                size="small"
                margin="normal"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              <TextField
                label="Order"
                color="primary"
                required
                fullWidth
                size="small"
                margin="normal"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
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
                label="Description"
                color="primary"
                required
                fullWidth
                size="small"
                margin="normal"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel htmlFor="gender">Category</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Gender"
                  value={form.category}
                  required
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {Object.keys(LEVEL_CATEGORY).map((key) => (
                    <MenuItem key={key} value={LEVEL_CATEGORY[key]}>
                      {LEVEL_CATEGORY[key]}
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
              {translations[language].delete_confirm || "Are you sure want to delete?"}
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

      {/* Levels Data */}
      <Box sx={{ my: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {levels.length > 0 ? (
              levels.map((level, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{level.code}</TableCell>
                  <TableCell>{level.order}</TableCell>
                  <TableCell>{level.title}</TableCell>
                  <TableCell>{level.category}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        <IconButton onClick={() => handleEdit(level)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(level._id)}>
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

export default Level;
