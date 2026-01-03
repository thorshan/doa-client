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
import React, { forwardRef, useState } from "react";
import { moduleApi } from "../../api/moduleApi";
import LoadingComponent from "../LoadingComponent";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModuleComponent = ({ action, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    key: "",
    order: "",
    title: "",
    icon: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await moduleApi.createModule(form);
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
            label="Key"
            color="primary"
            required
            fullWidth
            size="small"
            margin="normal"
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
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
            fullWidth
            size="small"
            margin="normal"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default ModuleComponent;
