import { Button, Tooltip, Accordion, AccordionSummary, AccordionDetails, List, ListItemButton, ListItemText } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
import { ExpandMore, Language } from "@mui/icons-material";

// Language options
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "mm", label: "မြန်မာ" },
  { code: "jp", label: "日本" },
  // Add more languages here
];

const LanguageToggler = () => {
  const { language, toggleLanguage } = useLanguage();

  const handleSelect = (lang) => {
    toggleLanguage(lang);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      <Accordion
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          "&::before": { display: "none" }, 
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Tooltip title="Change Language">
            <Button
              startIcon={<Language color="primary" />}
              color="primary"
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              {currentLang.label}
            </Button>
          </Tooltip>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <List disablePadding>
            {LANGUAGES.map((lang) => (
              <ListItemButton
                key={lang.code}
                selected={lang.code === language}
                onClick={() => handleSelect(lang.code)}
                sx={{
                  px: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <ListItemText primary={lang.label} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default LanguageToggler;
