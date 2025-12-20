import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { ClassRounded, ExpandMore, HomeRounded } from "@mui/icons-material";
import { GET_STARTED } from "../../constants/basic";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/NavbarComponent";
import BreadCrumbs from "../../components/BreadCrumbs";

const BasicInfo = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
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
              name: "Basic",
            },
          ]}
        />
      </Box>
      <Box sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ my: 3 }}>
          Table Of Content
        </Typography>
        <Box sx={{ my: 3 }}>
          <Paper sx={{ borderRadius: 5, overflow: "hidden" }}>
            <Stack spacing={1}>
              {GET_STARTED.map((section) =>
                section.description.map((desc, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === `${section.tag}-${index}`}
                    onChange={handleChange(`${section.tag}-${index}`)}
                    sx={{ "&::before": { display: "none" } }}
                  >
                    {/* Accordion Header */}
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{ px: 2, py: 1.5 }}
                    >
                      <Typography fontWeight={600}>{desc.title}</Typography>
                    </AccordionSummary>

                    {/* Accordion Content */}
                    <AccordionDetails sx={{ px: 2, pb: 2 }}>
                      <Stack spacing={1.5}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "action.hover" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/basic/lectures/${desc._id}`, {
                              state: {
                                lecture: desc,
                                name: section.tag,
                                path: location.pathname,
                              },
                            });
                          }}
                        >
                          <Typography fontWeight={500}>{desc.tag}</Typography>
                        </Paper>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfo;
