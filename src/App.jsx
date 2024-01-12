import logo from './logo.svg';
import './App.css';
// import Breadcrumb from './Breadcrumb/Breadcrumb';
import Result from './components/Result/Result';
import { Box } from '@mui/material';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BlogArticle from './components/BlogArticle/BlogArticle';
import CssBaseline from '@mui/material/CssBaseline';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Result />,
  },
    {
    path: "company/:personId",
    element: <BlogArticle />,
  },
      {
    path: "person/:personId",
    element: <BlogArticle />,
  },
]);

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
