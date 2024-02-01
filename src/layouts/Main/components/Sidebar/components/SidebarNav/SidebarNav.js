import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

import NavItem from "./components/NavItem";
import { grey } from "@mui/material/colors";
import { GitHub } from "@mui/icons-material";
import { Typography } from "@mui/material";

const SidebarNav = ({ pages }) => {
  const theme = useTheme();
  const { mode } = theme.palette;

  const {
    landings: landingPages,
    secondary: secondaryPages,
    company: companyPages,
    account: accountPages,
    portfolio: portfolioPages,
    blog: blogPages,
  } = pages;
  const colorInvert = mode === "light";
  return (
    <Box>
      <Box width={1} paddingX={2} paddingY={1}>
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
      </Box>
      <Box paddingX={2} paddingY={2}>
        <Box marginLeft={4}>
          <NavItem
            title={"Energy"}
            id={"climate-pages"}
            // items={climate}
            // colorInvert={colorInvert}
          />
        </Box>
        <Box marginLeft={4}>
          <NavItem
            title={"Health"}
            id={"health-pages"}
            // items={health}
            // colorInvert={colorInvert}
          />
        </Box>
        <Box marginLeft={4}>
          <NavItem
            title={"Peace"}
            id={"war-pages"}
            // items={war}
            // colorInvert={colorInvert}
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
    </Box>
  );
};

SidebarNav.propTypes = {
  pages: PropTypes.object.isRequired,
};

export default SidebarNav;
