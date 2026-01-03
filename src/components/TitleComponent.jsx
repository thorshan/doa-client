import { Add, Refresh } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LevelComponent from "./froms/LevelComponent";
import KanjiComponent from "./froms/KanjiComponent";
import GrammarComponent from "./froms/GrammarComponent";
import VocabComponent from "./froms/VocabComponent";
import ModuleComponent from "./froms/ModuleComponent";
import LessonComponent from "./froms/LessonComponent";
import ExamComponent from "./froms/ExamComponent";
import QuestionComponent from "./froms/QuestionComponent";

const TitleComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path =
    location.pathname.split("/").filter(Boolean).pop() || "Dashboard";
  const [openDialog, setOpenDialog] = useState(false);

  // Refresh Handler
  const handleRefresh = () => {
    navigate(0);
  };

  // Add Handler
  const addHandler = () => {
    setOpenDialog(true);
  };

  // handle close
  const closeHandler = () => {
    setOpenDialog(!openDialog);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        {path === "dashboard" ? "Dashboard Overview" : `Manage ${path}`}
      </Typography>
      <Stack spacing={2} direction={"row"}>
        <Tooltip title="Refresh" arrow placement="top-start">
          <IconButton
            onClick={handleRefresh}
          >
            <Refresh sx={{ color: "primary.main"}} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add" arrow placement="top-start">
          <IconButton
            onClick={addHandler}
          >
            <Add sx={{ color: "primary.main"}}/>
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Dialog Modal */}
      {path === "exams" && <ExamComponent action={openDialog} toggle={closeHandler} />}
      {path === "questions" && <QuestionComponent action={openDialog} toggle={closeHandler} />}
      {path === "modules" && <ModuleComponent action={openDialog} toggle={closeHandler} />}
      {path === "lessons" && <LessonComponent action={openDialog} toggle={closeHandler} />}
      {path === "levels" && <LevelComponent action={openDialog} toggle={closeHandler} />}
      {path === "kanji" && <KanjiComponent action={openDialog} toggle={closeHandler} />}
      {path === "grammars" && <GrammarComponent action={openDialog} toggle={closeHandler} />}
      {path === "vocabularies" && <VocabComponent action={openDialog} toggle={closeHandler} />}
    </Box>
  );
};

export default TitleComponent;
