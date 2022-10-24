import { Button } from "@mui/material";
import React from "react";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

function App() {
    // See this tutorial for info on how to use react router (they recently changed the entire API in v6).
    // https://reactrouter.com/en/dev/start/tutorial

    const Root = () => {
        return (
            <>
                <Navbar></Navbar>
                <Outlet></Outlet>
            </>
        );
    };

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root></Root>,
            children: [
                {
                    path: "",
                    element: <Home></Home>,
                },
                {
                    path: "profile",
                    element: <Profile></Profile>,
                },
            ],
        },
    ]);

    return (
        <React.Fragment>
            <RouterProvider router={router}>
                <Navbar></Navbar>
            </RouterProvider>
        </React.Fragment>
    );
}

export default App;
