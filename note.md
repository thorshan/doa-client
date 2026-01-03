import { useTheme } from "@mui/material";

const RenderFurigana = ({ text, relatedKanji }) => {
  const theme = useTheme();
  const pattern = new RegExp(
    `(${relatedKanji.map((k) => k.character).join("|")})`,
    "g"
  );

  return text.split(pattern).map((part, index) => {
    const kanjiMatch = relatedKanji.find((k) => k.character === part);

    if (kanjiMatch) {
      return (
        <ruby key={index}>
          {kanjiMatch.character}
          <rt style={{ color: theme.palette.primary.main }}>{kanjiMatch.kunyomi[0]}</rt>
        </ruby>
      );
    }

    return part;
  });
};

export default RenderFurigana;


あなたはアゥン・アゥンですか。
...はい、私はアゥン・アゥンです。
သင်က အောင်အောင် ဖြစ်/ဟုတ်ပါသလား။
... ဟုတ်ကဲ့၊ ကျွန်တော်က အောင်အောင် ဖြစ်ပါတယ်။

const ChapterDetails = () => {
  const theme = useTheme();
  const location = useLocation();
  const { language } = useLanguage();
  const { patternId, lectureId } = useParams();
  const [lecture, setLecture] = useState([]);
  const [grammar, setGrammar] = useState([]);
  const [loading, setLoading] = useState(false);

  const path = location.pathname.split("/").filter(Boolean).pop() || "Home";

  const wordToFind = [
    "あの",
    "この",
    "これ",
    "は",
    "が",
    "を",
    "に",
    "です",
    "と",
    "も",
    "から",
    "まで",
    "より",
    "で",
    "ですか",
    "ません",
    "の",
    "それ",
  ];

  const fetchLecture = async () => {
    setLoading(true);
    try {
      const res = await lessonApi.getLesson(lectureId);
      setLecture(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrammar = async () => {
    setLoading(true);
    try {
      const res = await grammarApi.getGrammar(patternId);
      setGrammar(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrammar();
    fetchLecture();
  }, []);

  if (loading) return <LoadingComponent />;

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
              path: `/app/${lecture?.module?.key}`,
              name: lecture.title,
            },
            {
              icon: (
                <ArticleRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: window.location.href,
              name: grammar.structure,
            },
          ]}
        />
      </Box>
      <Box sx={{ px: 3 }}>
        <Box sx={{ my: 3 }}>
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {grammar.structure} 「 {grammar.title} 」
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              <RenderFurigana
                text={grammar.explanation}
                relatedKanji={grammar.relatedKanji}
              />
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              {grammar.meaning}
            </Typography>
          </Box>

          <Divider>
            <Chip label={translations[language].example} size="small" />
          </Divider>

          <Box
            sx={{
              my: 2,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "text.secondary",
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                p: 2,
                borderRadius: 5,
                mb: 2,
              }}
            >
              {grammar.title}
            </Typography>

            <Stack direction={"column"} spacing={2}>
              {grammar?.examples.length > 0 &&
                grammar.examples.map((eg, index) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                    key={index}
                  >
                    <Chip
                      label={`${translations[language].example} ${index + 1}`}
                      sx={{
                        mt: 1,
                        color: "text.secondary",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    />
                    <Box
                      sx={{
                        width: "100%",
                        border: 1,
                        borderColor: "primary.main",
                        borderRadius: 5,
                        px: 1.5,
                        py: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Badge
                        badgeContent={"Person 1"}
                        overlap="circular"
                        color="primary"
                        align="right"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 260,
                            mt: 2,
                            backgroundColor: alpha(
                              theme.palette.action.hover,
                              0.1
                            ),
                            p: 2,
                            borderRadius: 5,
                          }}
                        >
                          <RenderFurigana
                            text={eg.jp1}
                            relatedKanji={grammar.relatedKanji}
                          />
                          {/* {eg.jp1} */}
                        </Typography>
                      </Badge>
                      <Badge
                        badgeContent={"Person 1"}
                        overlap="circular"
                        color="primary"
                        align="right"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        sx={{ mt: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 260,
                            mt: 2,
                            backgroundColor: alpha(
                              theme.palette.action.hover,
                              0.1
                            ),
                            p: 2,
                            borderRadius: 5,
                          }}
                        >
                          {eg.mm1}
                        </Typography>
                      </Badge>
                      <Badge
                        sx={{ alignSelf: "flex-end", mt: 1 }}
                        badgeContent={"Person 2"}
                        overlap="circular"
                        color="primary"
                        align="right"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 260,
                            mt: 2,
                            backgroundColor: alpha(
                              theme.palette.action.hover,
                              0.1
                            ),
                            p: 2,
                            borderRadius: 5,
                          }}
                        >
                          <RenderFurigana
                            text={eg.jp2}
                            relatedKanji={grammar.relatedKanji}
                          />
                        </Typography>
                      </Badge>
                      <Badge
                        sx={{ alignSelf: "flex-end", mt: 1 }}
                        badgeContent={"Person 2"}
                        overlap="circular"
                        color="primary"
                        align="right"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 260,
                            mt: 2,
                            backgroundColor: alpha(
                              theme.palette.action.hover,
                              0.1
                            ),
                            p: 2,
                            borderRadius: 5,
                          }}
                        >
                          {eg.mm2}
                        </Typography>
                      </Badge>
                    </Box>
                  </Box>
                ))}
            </Stack>
          </Box>
          {/* <Divider>
            <Chip label="Notice" size="small" />
          </Divider>
          <Box
            sx={{
              border: 1,
              borderColor: "primary.main",
              borderRadius: 5,
              p: 2,
              my: 2,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "text.secondary",
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                p: 2,
                borderRadius: 5,
                mb: 2,
              }}
            >
              Remark
            </Typography>

            <Typography variant="body1" sx={{ my: 1, color: "text.secondary" }}>
              {lecture.remark.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{ my: 3, color: "primary.main", mb: 2 }}
            >
              {"＊ "}
              {lecture.remark.note}
            </Typography>

            <Stack direction={"column"} spacing={2} sx={{ my: 3 }}>
              {lecture.remark.content.map((rmk, index) => (
                <Box key={index}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {rmk}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};


Chapter တစ်ခုပြီးတိုင်း Quiz ထည့်ရန်