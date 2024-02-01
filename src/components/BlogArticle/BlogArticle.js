import React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import SimpleBackdrop from "../LoadingPage";
import Main from "../../layouts/Main";
import Container from "../Container";
import {
  Content,
  // FooterNewsletter,
  Hero,
  SidebarArticles,
  // SidebarNewsletter,
  SimilarStories,
} from "./components";
import { useLocation } from "react-router-dom";

const BlogArticle = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  // load data from json
  // fetch data
  const [companiesAll, setCompaniesAll] = React.useState([]);
  const [peopleAll, setPeopleAll] = React.useState([]);

  React.useEffect(() => {
    console.log("loading data..");
    const companies = require("../../data/companies.json");
    const people = require("../../data/people.json");
    setCompaniesAll(companies);
    setPeopleAll(people);
    console.log("data loaded");
  }, []);

  // get path from router
  const { pathname } = useLocation();
  // extract id from path
  const type = pathname.split("/")[1];
  const id = pathname.split("/").pop();
  const baseFile = type === "company" ? companiesAll : peopleAll;
  const data = baseFile.find((item) => item.id === id) || {
    name: "Loading...",
    description: "Loading...",
    id: "loading",
  };
  const chunks = data ? data.name.toLowerCase().split(" ") : [];
  const similar = baseFile
    .filter(
      (item) =>
        item.name &&
        chunks.every((chunk) => item.name.toLowerCase().includes(chunk))
    )
    .slice(0, 3);
  return (
    <Main colorInvert={true}>
      <SimpleBackdrop open={!data.id} />
      <Box>
        <Hero data={data} />
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Content data={data} />
            </Grid>
            <Grid item xs={12} md={4}>
              {isMd ? (
                <Box marginBottom={4}>
                  <SidebarArticles />
                </Box>
              ) : null}
              {/* <SidebarNewsletter /> */}
            </Grid>
          </Grid>
        </Container>
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            marginBottom: -1,
            width: 1,
          }}
        >
          <path
            fill={"black"}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
      </Box>
      <Box bgcolor={"alternate.main"}>
        <Container>
          <SimilarStories similar={similar} />
        </Container>
        {/* <Container>
          <FooterNewsletter />
        </Container> */}
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            marginBottom: -1,
            width: 1,
          }}
        >
          <path
            fill={"black"}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
      </Box>
    </Main>
  );
};

export default BlogArticle;
