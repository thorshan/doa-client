import { NavigateNextRounded } from "@mui/icons-material";
import { Breadcrumbs, Link, Paper, Typography } from "@mui/material";

const BreadCrumbs = ({ items }) => {
  return (
    <Paper sx={{ p: 1, borderRadius: 5, px: 2 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextRounded fontSize="small" />}
        sx={{ alignItems: "center" }}
      >
        {items.map((item, index) => (
          <Link
            underline="none"
            key={index}
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href={item.path}
          >
            {item.icon}
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              {item.name}
            </Typography>
          </Link>
        ))}
      </Breadcrumbs>
    </Paper>
  );
};

export default BreadCrumbs;
