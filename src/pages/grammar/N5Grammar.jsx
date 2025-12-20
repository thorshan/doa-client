import { Box, Typography } from "@mui/material";
import LectureComponent from "../../components/LectureComponent";
import NavbarComponent from "../../components/NavbarComponent";
import { ClassRounded, HomeRounded } from "@mui/icons-material";
import BreadCrumbs from "../../components/BreadCrumbs";

const N5Grammar = () => {
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
              path: window.location.href,
              name: "N5",
            },
          ]}
        />
      </Box>
      <Box sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ my: 3 }}>
          Table Of Content
        </Typography>
        <Box sx={{ my: 3 }}>
          <LectureComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default N5Grammar;
