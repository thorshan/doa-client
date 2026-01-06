import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ExpandMore, LockRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { lessonApi } from "../api/lessonApi";
import { progressApi } from "../api/progressApi";

const LectureComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  /* ================= FETCH ================= */

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [lectureRes, progressRes] = await Promise.all([
          lessonApi.getAllLesson(),
          progressApi.getProgress(),
        ]);

        if (!isMounted) return;

        setLectures(Array.isArray(lectureRes?.data) ? lectureRes.data : []);
        setProgress(Array.isArray(progressRes?.data) ? progressRes.data : []);
      } catch (error) {
        console.error("LectureComponent fetch error:", error);
        if (isMounted) {
          setLectures([]);
          setProgress([]);
        }
      }
    };

    fetchData();
    return () => (isMounted = false);
  }, []);

  /* ================= PROGRESS LOOKUP ================= */

  const progressMap = useMemo(() => {
    const map = new Map();
    progress.forEach((p) => {
      if (p?.lecture) map.set(p.lecture, p);
    });
    return map;
  }, [progress]);

  const unlockedLectureIds = useMemo(() => {
    const unlocked = new Set();

    lectures.forEach((lecture, index) => {
      if (index === 0) {
        unlocked.add(lecture._id);
        return;
      }

      const prevLectureId = lectures[index - 1]?._id;
      const prevProgress = progressMap.get(prevLectureId);

      if (prevProgress?.testPassed) {
        unlocked.add(lecture._id);
      }
    });

    return unlocked;
  }, [lectures, progressMap]);

  /* ================= HANDLERS ================= */

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderItem = ({ title, locked, onClick }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: locked ? "transparent" : "action.hover",
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (locked) return;
        onClick();
      }}
    >
      <Typography fontWeight={500}>{title}</Typography>

      {locked && <LockRounded fontSize="small" />}
    </Paper>
  );

  /* ================= RENDER ================= */

  return (
    <Paper sx={{ borderRadius: 5, overflow: "hidden" }}>
      <Stack spacing={1}>
        {lectures.map((lecture) => {
          const unlocked = unlockedLectureIds.has(lecture._id);

          return (
            <Accordion
              key={lecture._id}
              expanded={expanded === lecture._id}
              onChange={handleChange(lecture._id)}
              sx={{ "&::before": { display: "none" } }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight={600}>{lecture.title}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={2}>
                  {lecture.speaking && (
                    <>
                      <Typography fontWeight={600}>
                        {lecture.speaking.title}
                      </Typography>

                      {renderItem({
                        title: lecture.speaking.description,
                        locked: !unlocked,
                        onClick: () =>
                          navigate(
                            `/app/grammar/lectures/${lecture._id}/speaking/${lecture?.speaking?._id}`,
                            {
                              state: {
                              lectureId: lecture._id,
                              speakingId: lecture?.speaking?._id,
                            },
                            }
                          ),
                      })}
                    </>
                  )}

                  {/* ================= GRAMMAR ================= */}
                  <Typography fontWeight={600}>Grammar</Typography>

                  {lecture.grammarPatterns?.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      No grammar available
                    </Typography>
                  )}

                  {lecture.grammarPatterns?.map((g) =>
                    renderItem({
                      title: g.structure,
                      locked: !unlocked,
                      onClick: () =>
                        navigate(
                          `/app/grammar/lectures/${lecture._id}/pattern/${g._id}`,
                          {
                            state: {
                              lectureId: lecture._id,
                              grammarId: g._id,
                            },
                          }
                        ),
                    })
                  )}
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
