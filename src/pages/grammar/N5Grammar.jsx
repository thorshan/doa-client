import {
  Box,
  Card,
  CardActionArea,
  Typography,
  LinearProgress,
} from "@mui/material";
import LectureComponent from "../../components/LectureComponent";
import NavbarComponent from "../../components/NavbarComponent";
import { ClassRounded, HomeRounded } from "@mui/icons-material";
import BreadCrumbs from "../../components/BreadCrumbs";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../constants/translations";
import { useEffect, useState } from "react";
import { progressApi } from "../../api/progressApi";
import { useNavigate } from "react-router-dom";
import { lessonApi } from "../../api/lessonApi";

const N5Grammar = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressApi.getLatestProgress();
        setProgress(res.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <Box>
      <NavbarComponent />

      <Box px={3}>
        <BreadCrumbs
          items={[
            {
              icon: (
                <HomeRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: "/app",
              name: "Home",
            },
            {
              icon: (
                <ClassRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: window.location.href,
              name: "N5",
            },
          ]}
        />
      </Box>

      <Box sx={{ px: 3 }}>
        {/* ================= CONTINUE LEARNING CARD ================= */}
        {!loading && progress && progress.lecture && (
          <Box sx={{ my: 3 }}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <CardActionArea
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
                onClick={async () => {
                  try {
                    // Fetch current lecture data
                    const res = await lessonApi.getLesson(progress.lecture._id);
                    const lecture = res.data;

                    // Fetch all lectures (to find next one)
                    const allRes = await lessonApi.getAllLesson();
                    const allLectures = allRes.data;

                    // Find index of current lecture
                    const currentIndex = allLectures.findIndex(
                      (l) => l._id === progress.lecture._id
                    );

                    // Check if user passed this chapter
                    const passed = progress.testPassed;

                    if (
                      passed &&
                      currentIndex !== -1 &&
                      currentIndex < allLectures.length - 1
                    ) {
                      // Next lecture exists
                      const nextLecture = allLectures[currentIndex + 1];
                      const firstPattern = nextLecture.grammarPatterns?.[0];
                      if (firstPattern?._id) {
                        navigate(
                          `/app/grammar/lectures/${nextLecture._id}/pattern/${firstPattern._id}`
                        );
                      } else {
                        navigate(`/app/grammar`);
                      }
                    } else {
                      // Resume current lecture
                      const firstPattern = lecture.grammarPatterns?.[0];
                      if (firstPattern?._id) {
                        navigate(
                          `/app/grammar/lectures/${lecture._id}/pattern/${firstPattern._id}`
                        );
                      } else {
                        navigate(`/app/grammar`);
                      }
                    }
                  } catch (error) {
                    console.error(error);
                    navigate(`/app/grammar`);
                  }
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Continue Learning
                </Typography>

                <Typography variant="body1" fontWeight={500}>
                  {progress.lecture.title}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Chapter {progress.testPassed ? "completed" : "in progress"}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={progress.testPassed ? 100 : 50} // optional: partial progress
                  sx={{
                    width: "100%",
                    height: 8,
                    borderRadius: 10,
                  }}
                />
              </CardActionArea>
            </Card>
          </Box>
        )}

        {/* ================= LECTURES ================= */}
        <Typography variant="h5" sx={{ my: 3 }}>
          {translations[language].table_content}
        </Typography>

        <Box sx={{ my: 3 }}>
          <LectureComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default N5Grammar;
