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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
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
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={{ sm: 3, xs: 2 }} alignItems="center">
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

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" component="div">
          <RenderFuriganaInteractive
            content={card.content}
            furigana={card.furigana}
          />
        </Typography>
      </Box>

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
                <strong>{translations[language].kanji} : </strong> {selectedKanji.kanji}
              </Typography>
              <Typography variant="body1">
                <strong>{translations[language].reading} :</strong> {selectedKanji.reading}
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

      <Box>
        <Typography variant="h5" sx={{ my : 2}}>Kanji List</Typography>
        <Table size="small" sx={{ border: 1, borderColor: "primary.main"}}>
          <TableHead sx={{backgroundColor: "primary.main"}}>
            <TableRow>
              <TableCell>{translations[language]._no}</TableCell>
              <TableCell align="right">{translations[language].kanji}</TableCell>
              <TableCell align="right">{translations[language].reading}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {card.furigana.map((item, index) => (
              <TableRow key={item._id} sx={{'&:nth-of-type(odd)': {
                backgroundColor: "action.hover"
              }}}>
                <TableCell>{index + 1}</TableCell>
                <TableCell align="right">{item.kanji}</TableCell>
                <TableCell align="right">{item.reading}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default CardDetails;
