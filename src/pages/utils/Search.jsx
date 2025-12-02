import {
  Box,
  Stack,
  Button,
  Typography,
  Paper,
  InputBase,
  TextField,
  MenuItem,
  Backdrop,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack, SearchRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";
import { cardApi } from "../../api/cardApi";
import { CATEGORY } from "../../constants/category";
import { LEVEL } from "../../constants/level";
import CardComponent from "../../components/CardComponent";
import AlertModal from "../../components/AlertModal";

const searchBarStyles = {
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  mx: { xs: 1, md: 3 },
};

const searchInputContainerStyles = {
  flexGrow: 1,
  position: "relative",
  borderRadius: 4,
  maxWidth: "100%",
};

const searchIconWrapperStyles = {
  padding: "0 16px",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const inputBaseStyles = {
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "10px 10px 10px 50px",
    width: "100%",
  },
};

const Search = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { language } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Device size
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await cardApi.getAllCards();
      setCards(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  // Handle Search
  const handleSearch = () => {
    setResults((prev) => !prev);
    setShowFilter(true);
    const data = cards.filter((value) => value.title.includes(search));
    setResults(data);
  };

  // Handle Filters
  const handleFilter = (event) => {
    event.preventDefault();
    let filtered = results;
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }
    if (level) {
      filtered = filtered.filter((item) => item.level === level);
    }
    setResults(filtered);
    setIsFiltered(true);
  };

  // Handle reset
  const resetFiltered = () => {
    handleSearch();
    setCategory("");
    setLevel("");
    setIsFiltered(false);
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

  return (
    <Box sx={{ p: { sm: 3, xs: 2 } }}>
      {error && <AlertModal type={"error"} message={error} />}
      <Stack direction={"row"} spacing={{ sm: 3, xs: 2 }}>
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
          sx={{ mt: 3 }}
        >
          {translations[language].search}
        </Typography>
      </Stack>
      <Box sx={{ mt: 3 }}>
        {showFilter ? (
          <>
            <Box
              component="form"
              onSubmit={handleFilter}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                gap: 2,
              }}
            >
              {!isMobile && (
                <Typography variant="subtitle1">
                  {translations[language].filter}
                </Typography>
              )}
              <TextField
                fullWidth
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                margin="normal"
                size="small"
              >
                {Object.keys(CATEGORY).map((key) => (
                  <MenuItem key={key} value={CATEGORY[key]}>
                    {translations[language][key]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                margin="normal"
                size="small"
              >
                {Object.values(LEVEL).map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
              <Button type="submit" variant="contained" color="primary">
                {translations[language].submit}
              </Button>
              {isFiltered && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={resetFiltered}
                >
                  {translations[language].reset}
                </Button>
              )}
            </Box>
            <Box sx={{ mt: 3 }}>
              {results && results.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <CardComponent data={result} index={index} />
                  ))}
                </>
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {translations[language].no_data}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {translations[language].expolre_search}
          </Typography>
        )}
      </Box>
      <Paper
        sx={{
          position: "fixed",
          bottom: 12,
          left: 0,
          right: 0,
          mx: "auto",
          width: "95%",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: theme.palette.primary.main + "20",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
        elevation={4}
      >
        <Box>
          <Box sx={searchBarStyles}>
            <Box sx={searchInputContainerStyles}>
              <Box sx={searchIconWrapperStyles}>
                <SearchRounded />
              </Box>
              <InputBase
                placeholder={translations[language].search}
                inputProps={{ "aria-label": "search" }}
                sx={inputBaseStyles}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Search;
