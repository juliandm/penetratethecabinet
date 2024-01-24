import React, { useEffect } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import Container from "../../../Container";

const Hero = ({ data }) => {
  useEffect(() => {
    const jarallaxInit = async () => {
      const jarallaxElems = document.querySelectorAll(".jarallax");
      if (!jarallaxElems || (jarallaxElems && jarallaxElems.length === 0)) {
        return;
      }

      const { jarallax } = await import("jarallax");
      jarallax(jarallaxElems, { speed: 0.2 });
    };

    jarallaxInit();
  });

  return (
    <Box
      className={"jarallax"}
      data-jarallax
      data-speed="0.2"
      position={"relative"}
      minHeight={{ xs: 400, sm: 500, md: 500 }}
      display={"flex"}
      marginTop={-13}
      paddingTop={13}
      alignItems={"center"}
      id="agency__portfolio-item--js-scroll"
    >
      <Box
        className={"jarallax-img"}
        sx={{
          position: "absolute",
          objectFit: "cover",
          /* support for plugin https://github.com/bfred-it/object-fit-images */
          fontFamily: "object-fit: cover;",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundImage: `url(https://wef-images.s3.eu-central-1.amazonaws.com/images/${data.id}.jpg)`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 1,
          height: 1,
          background: alpha("#161c2d", 0.6),
          zIndex: 1,
        }}
      />
      <Container position={"relative"} zIndex={2}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 400,
              color: "common.white",
              marginBottom: 2,
            }}
          >
            {data.name}
          </Typography>
          <Box display={"flex"} alignItems={"center"}>
            {/* <Avatar
              sx={{ width: 60, height: 60, marginRight: 2 }}
              src={"https://assets.maccarianagency.com/avatars/img3.jpg"}
            /> */}
            <ListItemText
              sx={{ margin: 0 }}
              primary={data.title}
              secondary={
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#dcdcdc",
                  }}
                >
                  Source
                </a>
              }
              primaryTypographyProps={{
                variant: "h6",
                sx: { color: "common.white" },
              }}
              secondaryTypographyProps={{
                sx: { color: alpha("#ffffff", 0.8), marginTop: 2 },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
