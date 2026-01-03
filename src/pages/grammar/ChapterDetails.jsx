import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import NavbarComponent from "../../components/NavbarComponent";
import BreadCrumbs from "../../components/BreadCrumbs";
import { ArticleRounded, ClassRounded, HomeRounded } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";
import { lessonApi } from "../../api/lessonApi";
import LoadingComponent from "../../components/LoadingComponent";
import RenderFurigana from "../../components/RenderFurigana";
import { grammarApi } from "../../api/grammarApi";

const ChapterDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { lectureId, patternId } = useParams();

  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [grammar, setGrammar] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [lectureRes, grammarRes, lecturesRes] = await Promise.all([
          lessonApi.getLesson(lectureId),
          grammarApi.getGrammar(patternId),
          lessonApi.getAllLesson(),
        ]);

        setLecture(lectureRes.data);
        setGrammar(grammarRes.data);

        setLectures(
          lecturesRes.data.sort((a, b) =>
            a.createdAt.localeCompare(b.createdAt)
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lectureId, patternId]);

  if (loading) return <LoadingComponent />;
  if (!lecture || !grammar) return null;

  /* ================= NAVIGATION LOGIC ================= */

  const getGrammarId = (g) => (typeof g === "string" ? g : g?._id);

  const lectureIndex = lectures.findIndex((l) => l._id === lecture._id);
  const grammarIds = lecture.grammarPatterns || [];

  const grammarIndex = grammarIds.findIndex(
    (g) => getGrammarId(g) === grammar._id
  );

  const isLastGrammarOfChapter = grammarIndex === grammarIds.length - 1;

  let prevLecture = null;
  let prevGrammarId = null;
  let nextLecture = null;
  let nextGrammarId = null;

  /* PREVIOUS */
  if (grammarIndex > 0) {
    prevLecture = lecture;
    prevGrammarId = getGrammarId(grammarIds[grammarIndex - 1]);
  } else if (lectureIndex > 0) {
    const prevLec = lectures[lectureIndex - 1];
    prevLecture = prevLec;
    prevGrammarId = getGrammarId(prevLec.grammarPatterns.at(-1));
  }

  /* NEXT */
  if (!isLastGrammarOfChapter) {
    nextLecture = lecture;
    nextGrammarId = getGrammarId(grammarIds[grammarIndex + 1]);
  }

  const handleNavigate = (lec, grammarId) => {
    navigate(`/app/grammar/lectures/${lec._id}/pattern/${grammarId}`);
  };

  /* ================= RENDER ================= */

  return (
    <Box>
      <NavbarComponent />

      {/* ================= BREADCRUMBS ================= */}
      <Box px={3}>
        <BreadCrumbs
          items={[
            {
              icon: <HomeRounded fontSize="inherit" />,
              path: "/app",
              name: "Home",
            },
            {
              icon: <ClassRounded fontSize="inherit" />,
              path: "/app/grammar",
              name: lecture.title,
            },
            {
              icon: <ArticleRounded fontSize="inherit" />,
              path: window.location.href,
              name: grammar.structure,
            },
          ]}
        />
      </Box>

      {/* ================= GRAMMAR CONTENT ================= */}
      <Box px={3} my={3}>
        <Typography fontWeight="bold">
          {grammar.structure} 「 {grammar.title} 」
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          <RenderFurigana
            text={grammar.explanation}
            relatedKanji={grammar.relatedKanji}
          />
        </Typography>

        <Typography sx={{ mt: 2 }}>{grammar.meaning}</Typography>

        <Divider sx={{ my: 3 }}>
          <Chip label={translations[language].example} size="small" />
        </Divider>

        {/* ================= EXAMPLES ================= */}
        <Stack spacing={2}>
          {grammar.examples?.map((eg, index) => (
            <Box key={index}>
              <Chip label={`Example ${index + 1}`} sx={{ mb: 2 }} />

              <Box
                sx={{
                  border: 1,
                  borderColor: "primary.main",
                  borderRadius: 5,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Person 1 */}
                <Box sx={{ alignSelf: "flex-start", maxWidth: "75%" }}>
                  <Typography variant="caption">Person 1</Typography>
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      borderRadius: "16px 16px 16px 4px",
                      p: 1.5,
                    }}
                  >
                    <Typography>
                      <RenderFurigana
                        text={eg.jp1}
                        relatedKanji={grammar.relatedKanji}
                      />
                    </Typography>
                    <Typography variant="caption">{eg.mm1}</Typography>
                  </Box>
                </Box>

                {/* Person 2 */}
                <Box sx={{ alignSelf: "flex-end", maxWidth: "75%" }}>
                  <Typography variant="caption">Person 2</Typography>
                  <Box
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.secondary.main,
                        0.12
                      ),
                      borderRadius: "16px 16px 4px 16px",
                      p: 1.5,
                    }}
                  >
                    <Typography>
                      <RenderFurigana
                        text={eg.jp2}
                        relatedKanji={grammar.relatedKanji}
                      />
                    </Typography>
                    <Typography variant="caption">{eg.mm2}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* ================= NAVIGATION ================= */}
        <Stack direction="row" justifyContent="space-between" sx={{ my: 4 }}>
          <Button
            variant="contained"
            disabled={!prevLecture}
            onClick={() => handleNavigate(prevLecture, prevGrammarId)}
          >
            {translations[language].previous}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!isLastGrammarOfChapter) {
                handleNavigate(nextLecture, nextGrammarId);
              } else {
                navigate(`/app/exams/lecture/${lecture._id}`);
              }
            }}
          >
            {isLastGrammarOfChapter
              ? translations[language].take_test || "Take Test"
              : translations[language].next}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChapterDetails;
