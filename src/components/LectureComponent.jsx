import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ExpandMore, LockRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { lessonApi } from "../api/lessonApi";
import { progressApi } from "../api/progressApi";

const LectureComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lectureRes, progressRes] = await Promise.all([
          lessonApi.getAllLesson(),
          progressApi.getProgress(),
        ]);

        setLectures(lectureRes.data);
        setProgress(progressRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isLectureUnlocked = (index) => {
    if (index === 0) return true;

    const prevLectureId = lectures[index - 1]?._id;
    const prevProgress = progress.find(
      (p) => p.lecture === prevLectureId
    );

    return prevProgress?.testPassed === true;
  };

  return (
    <Paper sx={{ borderRadius: 5, overflow: "hidden" }}>
      <Stack spacing={1}>
        {lectures.map((lecture, index) => {
          const unlocked = isLectureUnlocked(index);

          return (
            <Accordion
              key={lecture._id}
              expanded={expanded === lecture._id}
              onChange={handleChange(lecture._id)}
              sx={{ "&::before": { display: "none" } }}
            >
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, py: 1.5 }}>
                <Typography fontWeight={600}>
                  {lecture.title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <Stack spacing={1.5}>
                  {lecture.grammarPatterns?.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      No grammar available
                    </Typography>
                  )}

                  {lecture.grammarPatterns?.filter(Boolean).map((g) => {
                    const disabled = !unlocked;

                    return (
                      <Paper
                        key={g._id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.6 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          "&:hover": {
                            backgroundColor: disabled
                              ? "transparent"
                              : "action.hover",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (disabled) return;

                          navigate(
                            `/app/grammar/lectures/${lecture._id}/pattern/${g._id}`,
                            {
                              state: {
                                lectureId: lecture._id,
                                grammarId: g._id,
                              },
                            }
                          );
                        }}
                      >
                        <Typography fontWeight={500}>
                          {g.structure}
                        </Typography>

                        {disabled && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LockRounded fontSize="small" />
                          </Box>
                        )}
                      </Paper>
                    );
                  })}
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default LectureComponent;
