import { Box, Typography, Dialog, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { kanjiApi } from "../../api/kanjiApi";
import { levelApi } from "../../api/levelApi";
import LoadingComponent from "../../components/LoadingComponent";
import NavbarComponent from "../../components/NavbarComponent";
import BreadCrumbs from "../../components/BreadCrumbs";
import { ClassRounded, HomeRounded } from "@mui/icons-material";
import KanjiDialog from "./KanjiDialog";

const Kanji = () => {
  const [kanjis, setKanjis] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKanji, setActiveKanji] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelRes, kanjiRes] = await Promise.all([
          levelApi.getAllLevel(),
          kanjiApi.getAllKanji(),
        ]);
        setLevels(levelRes.data);
        setKanjis(kanjiRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <Box>
      <NavbarComponent />

      <Box px={2} mb={3}>
        <BreadCrumbs
          items={[
            {
              icon: (
                <HomeRounded
                  fontSize="inherit"
                  sx={{ mr: 0.5, color: "primary.main" }}
                />
              ),
              path: "/app",
              name: "Home",
            },
            {
              icon: (
                <ClassRounded
                  fontSize="inherit"
                  sx={{ mr: 0.5, color: "primary.main" }}
                />
              ),
              path: window.location.href,
              name: "Moji",
            },
          ]}
        />
      </Box>

      <Box px={3} mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Kanji
        </Typography>
      </Box>

      {levels.map((level) => {
        const levelKanjis = kanjis.filter((k) => k.level?._id === level._id);
        if (!levelKanjis.length) return null;

        return (
          <Box key={level._id} mb={4}>
            <Divider>
              <Typography px={2} mb={1} fontWeight="bold">
                {level.code}
              </Typography>
            </Divider>

            {/* Kanji grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(4, 1fr)",
                  sm: "repeat(6, 1fr)",
                  md: "repeat(8, 1fr)",
                },
                gap: 1.5,
                px: 2,
              }}
            >
              {levelKanjis.map((kanji) => (
                <Box
                  key={kanji._id}
                  onClick={() => setActiveKanji(kanji)}
                  sx={{
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": {
                      boxShadow: 4,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      fontWeight: "bold",
                    }}
                  >
                    {kanji.character}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}

      <KanjiDialog
        open={Boolean(activeKanji)}
        kanji={activeKanji}
        onClose={() => setActiveKanji(null)}
      />
    </Box>
  );
};

export default Kanji;
