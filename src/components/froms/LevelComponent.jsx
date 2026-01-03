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
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { LEVEL_CATEGORY } from "../../constants/category";
import { levelApi } from "../../api/levelApi";
import LoadingComponent from "../LoadingComponent";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LevelComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    order: "",
    title: "",
    description: "",
    category: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await levelApi.createLevel(form);
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <FormControl fullWidth size="small" margin="normal">
            <InputLabel htmlFor="gender">Category</InputLabel>
            <Select
              labelId="gender-label"
              label="Gender"
              value={form.category}
              required
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
  );
};

export default LevelComponent;
