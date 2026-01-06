import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  IconButton,
  CardMedia,
  Button,
} from "@mui/material";
import { ArrowBack, PlayArrowRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { speakingApi } from "../../api/speakingApi";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const SpeakingDetails = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const theme = localStorage.getItem("themeMode");
  const { speakingId } = useParams();
  const [speaking, setSpeaking] = useState(null);

  const avatarMap = {
    "ミャ・ミャ": "/assets/myamya.png",
    "キョー・キョー": "/assets/kyawkyaw.png",
    "エィー・エィー": "/assets/ayeaye.png",
  };

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchSpeaking = async () => {
      const res = await speakingApi.getSpeaking(speakingId);
      setSpeaking(res.data);
    };

    fetchSpeaking();
  }, [speakingId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!speaking) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={{ sm: 3, xs: 1 }}>
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={<ArrowBack />}
          sx={{ textTransform: "none" }}
          onClick={() => handleBack()}
        >
          {translations[language].go_back}
        </Button>
        <Typography
          variant="h6"
          fontWeight={{ sm: "bold" }}
          color="text.primary"
          sx={{ mt: 3 }}
        >
          {speaking.title}
        </Typography>
      </Stack>

      {/* ===== DESCRIPTION / SITUATION ===== */}
      {speaking.description && (
        <Paper
          sx={{
            p: 2,
            my: 3,
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={600}>Descriptions</Typography>
          <Typography color="text.secondary">{speaking.description}</Typography>
        </Paper>
      )}

      {/* ===== KAIWA LINES ===== */}
      <Stack spacing={2}>
        {[...speaking.lines]
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((line) => (
            <Paper
              key={line.orderIndex}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={0.5}>
                {/* Speaker */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Speaker */}
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      component="img"
                      src={
                        avatarMap[line.speaker.nameJa] || "/assets/default.png"
                      }
                      alt={line.speaker.nameJa}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                        mixBlendMode: "difference",
                        border: "1px solid",
                        borderColor: "divider",
                        filter: theme === "dark" ? "none" : "invert(1)",
                      }}
                    />

                    <Box>
                      <Typography fontWeight={600}>
                        {line.speaker.nameJa}
                      </Typography>

                      {line.speaker.nameMm && (
                        <Typography variant="caption" color="text.secondary">
                          {line.speaker.nameMm}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Audio */}
                  {line.audioUrl && (
                    <IconButton size="small">
                      <PlayArrowRounded />
                    </IconButton>
                  )}
                </Box>

                {/* Japanese */}
                <Typography fontSize={16}>{line.textJa}</Typography>

                {/* Myanmar */}
                <Typography variant="body2" color="text.secondary">
                  {line.textMn}
                </Typography>
              </Stack>
            </Paper>
          ))}
      </Stack>

      {/* ===== ROLE PLAY ===== */}
      <Divider sx={{ my: 4 }} />

      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "primary.soft",
        }}
      >
        <Typography fontWeight={600}>Role Play</Typography>
        <Typography color="text.secondary">
          Read the dialogue aloud. Change roles and practice again.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SpeakingDetails;
