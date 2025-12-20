import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import { COURSES } from "../constants/courses";
import { useLocation, useNavigate } from "react-router-dom";

const LectureComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper sx={{ borderRadius: 5, overflow: "hidden" }}>
      <Stack spacing={1}>
        {" "}
        {Object(COURSES).course.map((course) => (
          <Accordion
            key={course._id}
            expanded={expanded === course._id}
            onChange={handleChange(course._id)}
            sx={{
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography fontWeight={600}>{course.title}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Stack spacing={1.5}>
                {course?.lecture.map((lec) => (
                  <Paper
                    key={lec._id}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/app/grammar/courses/${course._id}/lectures/${lec._id}`,
                        {
                          state: {
                            course: course,
                            lecture: lec,
                            name: Object(COURSES.title).toString(),
                            path: location.pathname,
                          },
                        }
                      );
                    }}
                  >
                    <Typography fontWeight={500}>{lec.pattern}</Typography>
                  </Paper>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Paper>
  );
};

export default LectureComponent;
