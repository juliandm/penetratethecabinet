import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import { NavItem } from "./components";
import { Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const Topbar = ({ onSidebarOpen, pages, colorInvert = false }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const { climate, health, war } = pages;

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={1}
    >
      <Box
        display={"flex"}
        component="a"
        href="/"
        title="theFront"
        width={{ xs: 100, md: 120 }}
        style={{
          textDecoration: "none",
          color: "white",
        }}
      >
        <Typography
          style={{
            color: colorInvert ? "white" : "black",
          }}
        >
          World economic freedom
        </Typography>
      </Box>
      <Box sx={{ display: { xs: "none", md: "flex" } }} alignItems={"center"}>
        <Box marginLeft={4}>
          <NavItem
            title={"Energy"}
            id={"climate-pages"}
            items={climate}
            colorInvert={colorInvert}
          />
        </Box>
        <Box marginLeft={4}>
          <NavItem
            title={"Health"}
            id={"health-pages"}
            items={health}
            colorInvert={colorInvert}
          />
        </Box>
        <Box marginLeft={4}>
          <NavItem
            title={"Peace"}
            id={"war-pages"}
            items={war}
            colorInvert={colorInvert}
          />
        </Box>
        <Box marginLeft={4}>
          <Button
            startIcon={<GitHub />}
            variant="contained"
            component="a"
            target="blank"
            href="https://github.com/juliandm/penetratethecabinet"
            size="medium"
            sx={{
              color: "white",
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: grey[800],
              },
            }}
          >
            Get involved
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }} alignItems={"center"}>
        <Button
          onClick={() => onSidebarOpen()}
          aria-label="Menu"
          variant={"outlined"}
          sx={{
            borderRadius: 2,
            minWidth: "auto",
            padding: 1,
            borderColor: "black !important",
            color: "black !important",
          }}
        >
          <MenuIcon />
        </Button>
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.object,
  colorInvert: PropTypes.bool,
};

export default Topbar;
