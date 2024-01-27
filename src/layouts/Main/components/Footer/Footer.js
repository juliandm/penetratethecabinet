import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Container from "../../../../components/Container";
import { Coffee } from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Grid
      container
      sx={{
        padding: "0 30px",
        background: "black",
      }}
    >
      <Grid item xs={12}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={1}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Box
            display={"flex"}
            component="a"
            href="/"
            title="theFront"
            width={80}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <Typography
              style={{
                color: "white",
              }}
            >
              World economic freedom
            </Typography>
          </Box>
          <Box display="flex" flexWrap={"wrap"} alignItems={"center"}>
            <Box marginTop={1} marginRight={2}>
              <Link
                underline="none"
                component="a"
                href="/"
                color="white"
                variant={"subtitle2"}
              >
                Home
              </Link>
            </Box>
            <Box marginTop={1} marginRight={2}>
              <Link
                underline="none"
                component="a"
                href="https://thefront.maccarianagency.com/docs/introduction"
                target={"blank"}
                color="white"
                variant={"subtitle2"}
              >
                Documentation
              </Link>
            </Box>
            <Box marginTop={1}>
              <Button
                startIcon={<Coffee />}
                variant="outlined"
                color="primary"
                component="a"
                target="blank"
                href="https://ko-fi.com/juliandm"
                size="small"
              >
                Buy me a coffee
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography
          align={"center"}
          variant={"subtitle2"}
          color="white"
          gutterBottom
        >
          Created with ❤ in Germany
        </Typography>
        <Typography
          align={"center"}
          variant={"caption"}
          color="white"
          component={"p"}
        >
          If you want to help finance the server costs, consider buying me a
          coffee. Also it would be great if you could help out with data
          collection on{" "}
          <a
            href="https://github.com/juliandm/penetratethecabinet"
            style={{ color: "white" }}
          >
            github
          </a>{" "}
          so it's not just on me. Thanks!
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
