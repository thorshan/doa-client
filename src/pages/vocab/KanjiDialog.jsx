import {
  Box,
  Dialog,
  Divider,
  IconButton,
  Typography,
  Chip,
  DialogTitle,
  DialogContent,
  Stack,
} from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";

const KanjiDialog = ({ open, onClose, kanji }) => {
  if (!kanji) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: "center", bgcolor: "primary.main", color: "white" }}>
        Kanji Learning
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Kanji */}
        <Typography
          sx={{
            fontSize: "6rem",
            fontWeight: "bold",
            textAlign: "center",
            my: 1,
          }}
        >
          {kanji.character}
        </Typography>

        {/* Meta */}
        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
          <Chip label={`JLPT ${kanji.level?.code || "N/A"}`} />
          <Chip label={`${kanji.strokes} strokes`} />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Meanings */}
        {kanji.meaning && (
          <>
            <Typography fontWeight="bold">Meaning</Typography>
            <Typography sx={{ mb: 2 }}>{kanji.meaning?.join("၊ ") || "-"}</Typography>
          </>
        )}

        {/* Readings */}
        <Box sx={{ mb: 2 }}>
          <Typography fontWeight="bold">Onyomi</Typography>
          <Typography>{kanji.onyomi?.join("、") || "-"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography fontWeight="bold">Kunyomi</Typography>
          <Typography>{kanji.kunyomi?.join("、") || "-"}</Typography>
        </Box>

        {/* Examples */}
        {kanji.examples?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight="bold" gutterBottom>
              Examples
            </Typography>

            <Stack spacing={1}>
              {kanji.examples.map((ex, i) => (
                <Box key={i}>
                  <Typography fontWeight="bold">{ex.word}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ex.reading} — {ex.meaning}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KanjiDialog;
