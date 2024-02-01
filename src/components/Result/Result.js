import React from "react";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import Main from "../../layouts/Main";
import Container from "../Container";
import harold from "../../pictures/harold.webp";
import { Skeleton } from "@mui/material";

let timeoutId = null;
const Result = () => {
  const theme = useTheme();
  const [search, setSearch] = React.useState("");
  const [renderSearch, setRenderSearch] = React.useState(false);
  const navigate = useNavigate();

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

  React.useEffect(() => {
    clearTimeout(timeoutId);
    // Set a timeout to delay rendering the search results
    setRenderSearch(false);

    timeoutId = setTimeout(() => {
      setRenderSearch(true);
    }, 500); // Adjust the timeout duration (in milliseconds) as needed

    // Clear the timeout if the search string changes before the timeout completes
    return () => clearTimeout(timeoutId);
  }, [search]);
  const chunks = search.toLowerCase().split(" ");
  const companies = companiesAll
    .filter(
      (item) =>
        item.name &&
        chunks.every((chunk) => item.name.toLowerCase().includes(chunk))
    )
    .map((item) => ({ ...item, type: "company" }));
  const people = peopleAll
    .filter(
      (item) =>
        item.name &&
        chunks.every(
          (chunk) =>
            item.name.toLowerCase().includes(chunk) ||
            item.title.toLowerCase().includes(chunk)
        )
    )
    .map((item) => ({ ...item, type: "person" }));
  const all = [...companies, ...people];
  const outOfBounds =
    all.length > 30 || search.length === 0 || !renderSearch || all.length === 0;
  return (
    <Main bgcolor="black">
      <Container backgroundColor="black">
        <div
          style={{
            backgroundImage: `url(${harold})`,
            backgroundSize: "cover",
            position: "absolute",
            // filter: "brightness(50%)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
        <div
          style={{
            backgroundImage: `url(${harold})`,
            backgroundSize: "cover",
            position: "absolute",
            // filter: "brightness(50%)",
            background: "linear-gradient(to bottom, transparent, black)",
            // filter: "blur(5px)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box marginBottom={0} marginTop={30}>
            <Typography
              variant="h3"
              color="white"
              align={"center"}
              sx={{
                fontWeight: 700,
              }}
            >
              "You'll own nothing
              <br />
              And you'll be happy."
              <br />
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="white"
              sx={{ fontWeight: 400, marginTop: 5, padding: "0 100px" }}
              align={"center"}
            >
              - World economic forum -
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="white"
              sx={{
                fontWeight: 400,
                // padding: "0 100px",
                // background: "rgba(0,0,0,0.5)",
                marginTop: 10,
                margin: "100px 0 10px 0",
                padding: "50px 100px",
                // backgroundImage:
                //   "radial-gradient(ellipse farthest-corner at 45px 45px, rgba(50, 50, 50, 0.8) 0%, rgba(80, 80, 80, 0.2) )",
              }}
              align={"center"}
            >
              Welcome! This is a searchable open-source database of companies
              and people that are involved with the WEF. The WEF is an unelected
              global lobby organisation that seeks to connect the interests of
              big corporation with politicians and influential entrepeneurs,
              with the goal to build a world government.
              <br />
            </Typography>
            <Typography variant="h8" component="p" color="white">
              Some pictures might be off, if you find any misrepresentation or
              entries, feel free to create a Pull request on{" "}
              <a
                href="https://github.com/juliandm/penetratethecabinet"
                style={{ color: "white" }}
              >
                Github
              </a>
              .
            </Typography>
          </Box>
          <Box p={5}>
            <Box
              padding={2}
              width={1}
              // margin={5 5}
              component={Card}
              boxShadow={4}
              marginBottom={4}
            >
              <form noValidate autoComplete="off">
                <Box display="flex" alignItems={"center"}>
                  <Box width={1} marginRight={1}>
                    <TextField
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{
                        height: 54,
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "0 !important",
                        },
                      }}
                      variant="outlined"
                      color="primary"
                      size="medium"
                      placeholder="Search an article"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component={"svg"}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              width={24}
                              height={24}
                              color={"primary.main"}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box display={{ xs: "none", sm: "block" }} marginRight={2}>
                    <Typography
                      color={"text.secondary"}
                      variant={"subtitle2"}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {companies.length} Companies {people.length} People
                    </Typography>
                  </Box>
                  {/* <Box>
              <Button
                sx={{ height: 54, minWidth: 100, whiteSpace: "nowrap" }}
                variant="contained"
                color="primary"
                size="medium"
                fullWidth
              >
                Search
              </Button>
            </Box> */}
                </Box>
              </form>
            </Box>
            <Grid container spacing={4}>
              {outOfBounds ? (
                <Grid item xs={12} key={0} minHeight="300px">
                  <Typography color="white">
                    {!renderSearch
                      ? "Searching.."
                      : all.length === 0
                      ? "No results found."
                      : search.length === 0
                      ? "Search for a company or person."
                      : "Too many results. Please refine your search."}
                  </Typography>
                </Grid>
              ) : (
                all.map((item, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Box
                      component={"a"}
                      href={""}
                      display={"block"}
                      width={1}
                      height={1}
                      sx={{
                        textDecoration: "none",
                        transition: "all .2s ease-in-out",
                        "&:hover": {
                          transform: `translateY(-${theme.spacing(1 / 2)})`,
                        },
                      }}
                    >
                      <Box
                        onClick={() => navigate(`/${item.type}/${item.id}`)}
                        component={Card}
                        width={1}
                        height={1}
                        boxShadow={4}
                        display={"flex"}
                        flexDirection={"column"}
                        sx={{ backgroundImage: "none" }}
                      >
                        <CardMedia
                          image={item.image}
                          title={item.name}
                          sx={{
                            height: { xs: 300, md: 360 },
                            position: "relative",
                            backgroundImage: `url(https://wef-images.s3.eu-central-1.amazonaws.com/images/${item.id}.jpg)`,
                          }}
                        >
                          <Box
                            component={"svg"}
                            viewBox="0 0 2880 480"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              color: theme.palette.background.paper,
                              transform: "scale(2)",
                              height: "auto",
                              width: 1,
                              transformOrigin: "top center",
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2160 0C1440 240 720 240 720 240H0v240h2880V0h-720z"
                              fill="currentColor"
                            />
                          </Box>
                        </CardMedia>
                        <Box component={CardContent} position={"relative"}>
                          <Typography variant={"h6"} gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography color="text.secondary">
                            {item.title}
                          </Typography>
                        </Box>
                        <Box flexGrow={1} />
                        <Box
                          padding={2}
                          display={"flex"}
                          flexDirection={"column"}
                        >
                          <Box marginBottom={2}>
                            <Divider />
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Box display={"flex"} alignItems={"center"}>
                              {/* <Avatar
                        src={item.author.avatar}
                        sx={{ marginRight: 1 }}
                      /> */}
                              {/* <Typography color={"text.secondary"}>
                        {item.author.name}
                      </Typography> */}
                            </Box>
                            <Typography color={"text.secondary"}>
                              {item.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
              {/* <Grid item container justifyContent={"center"} xs={12}>
              <Button
                fullWidth
                variant={"outlined"}
                size={"large"}
                sx={{
                  height: 54,
                  maxWidth: 400,
                  justifyContent: "space-between",
                }}
                endIcon={
                  <Box
                    component={"svg"}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width={24}
                    height={24}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </Box>
                }
              >
                Load more
              </Button>
            </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Main>
  );
};

export default Result;
