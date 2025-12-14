import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  CircularProgress,
  Backdrop,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Zoom,
  Fab,
  Collapse,
} from "@mui/material";
import { ArrowBack, KeyboardArrowUpRounded } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { cardApi } from "../../api/cardApi";

const CardDetails = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { id } = useParams();
  const theme = useTheme();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [showBtn, setShowBtn] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [openGrammar, setOpenGrammar] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      try {
        const res = await cardApi.getCard(id);
        setCard(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch card");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBtn(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Interactive furigana renderer with modal
  const RenderFuriganaInteractive = ({ content, furigana }) => {
    if (!furigana || !content) return <>{content || ""}</>;

    let currentIndex = 0;
    const elements = [];

    furigana.forEach((item, i) => {
      const idx = content.indexOf(item.kanji, currentIndex);
      if (idx === -1) return;

      if (idx > currentIndex) {
        elements.push(content.slice(currentIndex, idx));
      }

      elements.push(
        <span
          key={i}
          style={{
            color: theme.palette.primary.main,
            cursor: "pointer",
          }}
          onClick={() => setSelectedKanji(item)}
        >
          {item.kanji}
        </span>
      );

      currentIndex = idx + item.kanji.length;
    });

    if (currentIndex < content.length) {
      elements.push(content.slice(currentIndex));
    }

    return <>{elements}</>;
  };

  if (loading)
    return (
      <Backdrop
        open={loading}
        sx={{
          color: "primary.loading",
          backgroundColor: "background.default",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  if (error) return <Typography color="error">{error}</Typography>;
  if (!card) return null;

  return (
    <Box sx={{ p: { sm: 3, xs: 2 } }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: "background.paper",
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={{ sm: 3, xs: 2 }}>
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<ArrowBack />}
            sx={{ textTransform: "none" }}
            onClick={handleBack}
          >
            {translations[language].go_back}
          </Button>
          <Typography
            variant="h6"
            fontWeight={{ sm: "bold" }}
            color="text.primary"
          >
            {card.title}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" component="div">
          <RenderFuriganaInteractive
            content={card.content}
            furigana={card.furigana}
          />
        </Typography>
      </Box>

      {/*  */}
      <Zoom in={showBtn}>
        <Fab
          color="primary"
          aria-label="back to top"
          onClick={handleClick}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpRounded />
        </Fab>
      </Zoom>
      {/*  */}

      {/* Kanji Modal */}
      <Dialog
        open={!!selectedKanji}
        onClose={() => setSelectedKanji(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{translations[language].kanji_info}</DialogTitle>
        <DialogContent>
          {selectedKanji && (
            <Box>
              <Typography variant="body1">
                <strong>{translations[language].kanji} : </strong>{" "}
                {selectedKanji.kanji}
              </Typography>
              <Typography variant="body1">
                <strong>{translations[language].reading} :</strong>{" "}
                {selectedKanji.reading}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedKanji(null)} color="primary">
            {translations[language].close}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Grammar notes */}
      <Box sx={{ mt: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {translations[language].grammar_note}
          </Typography>

          <Button size="small" onClick={() => setOpenGrammar((p) => !p)}>
            <Typography variant="button" color="primary">
              {openGrammar
                ? translations[language].close_list
                : translations[language].see_list}
            </Typography>
          </Button>
        </Stack>

        <Collapse in={openGrammar}>
          {card.grammar?.map((g, index) => (
            <Box
              key={g._id}
              sx={{
                p: 2,
                my: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {index + 1}. {g.pattern}
              </Typography>

              <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                {g.meaning}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                {translations[language].example}: {g.example}
              </Typography>
            </Box>
          ))}
        </Collapse>
      </Box>

      {/* Kanji List */}
      <Box sx={{ mb: 10 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {translations[language].kanji_list}
          </Typography>

          <Button onClick={() => setOpenTable((prev) => !prev)}>
            <Typography variant="button" color="primary">
              {openTable
                ? translations[language].close_list
                : translations[language].see_list}
            </Typography>
          </Button>
        </Box>

        <Collapse in={openTable} timeout="auto" unmountOnExit>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>
                  {translations[language]._no}
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  {translations[language].kanji}
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  {translations[language].reading}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {card.furigana.map((item, index) => (
                <TableRow
                  key={item._id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="right">{item.kanji}</TableCell>
                  <TableCell align="right">{item.reading}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>
      </Box>
    </Box>
  );
};

export default CardDetails;
