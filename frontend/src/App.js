import { Button } from "@mui/material";
import React from "react";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/profile",
            element: <Profile />,
        },
    ]);

    return (
        <React.Fragment>
            <Navbar></Navbar>
            <RouterProvider router={router}></RouterProvider>
        </React.Fragment>
    );
}

export default App;
