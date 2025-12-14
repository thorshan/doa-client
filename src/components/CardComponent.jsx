import {
  AccessTimeRounded,
  CategoryRounded,
  StarRounded,
} from "@mui/icons-material";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../constants/translations";

const CardComponent = ({ data, index }) => {
  const TruncatedTextStyles = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  };

  const { language } = useLanguage();

  const LangSwitcher = (data) => {
    switch (data) {
      case "Other":
        return translations[language].other;
      case "Anime":
        return translations[language].anime;
      case "Experience":
        return translations[language].experience;
      case "Comedy":
        return translations[language].comedy;
      default:
        data;
    }
  };

  return (
    <Card key={index} sx={{ my: 2, p: 1 }}>
      <CardActionArea
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: { sm: 2, xs: 1 },
          minWidth: 0,
        }}
        component={Link}
        to={`/cards/${data._id}`}
      >
        <Typography variant="h6" fontWeight={600}>
          {data.title}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ my: 1, ...TruncatedTextStyles }}
        >
          {data.content}
        </Typography>
      </CardActionArea>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          my: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccessTimeRounded
            sx={{ mr: 1, color: "primary.main", fontSize: 14 }}
          />
          <Typography variant="caption" color="primary">
            {new Date(data.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <StarRounded sx={{ mr: 1, color: "primary.main", fontSize: 14 }} />
          <Typography variant="caption" color="primary">
            {data.level}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryRounded
            sx={{ mr: 1, color: "primary.main", fontSize: 14 }}
          />
          <Typography variant="caption" color="primary">
            {LangSwitcher(data.category)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default CardComponent;
