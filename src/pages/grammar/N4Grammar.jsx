import { Box, Typography } from "@mui/material"
import NavbarComponent from "../../components/NavbarComponent"
import BreadCrumbs from "../../components/BreadCrumbs"
import { ClassRounded, HomeRounded } from "@mui/icons-material"

const N4Grammar = () => {
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
              name: "N4",
            },
          ]}
        />
      </Box>
      <Box sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ my: 3 }}>
          Table Of Content
        </Typography>
        <Box sx={{ my: 3 }}>
          {/* <LectureComponent /> */}
        </Box>
      </Box>
    </Box>
  )
}

export default N4Grammar