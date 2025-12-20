import {
  alpha,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import NavbarComponent from "../../components/NavbarComponent";
import BreadCrumbs from "../../components/BreadCrumbs";
import { ArticleRounded, ClassRounded, HomeRounded } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { translations } from "../../constants/translations";
import { useLanguage } from "../../context/LanguageContext";

const ChapterDetails = () => {
  const theme = useTheme();
  const { language } = useLanguage();
  const location = useLocation();
  const course = location.state?.course;
  const lecture = location.state?.lecture;
  const name = location.state?.name;
  const path = location.state?.path;

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
              path: `${path}`,
              name: name,
            },
            {
              icon: (
                <ArticleRounded
                  sx={{ mr: 0.5, color: "primary.main" }}
                  fontSize="inherit"
                />
              ),
              path: window.location.href,
              name: course.title,
            },
          ]}
        />
      </Box>
      <Box sx={{ px: 3 }}>
        <Box sx={{ my: 3 }}>
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {lecture.pattern}
            </Typography>

            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
              {lecture.meaning}
            </Typography>
          </Box>

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
              {translations[language].example}
            </Typography>

            <Stack direction={"column"} spacing={2}>
              {lecture.example.map((eg, index) => (
                <Box key={index}>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {index + 1}: {eg.pattern}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {eg.meaning}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Divider>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChapterDetails;
