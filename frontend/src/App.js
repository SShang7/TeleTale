import React from "react";
import Profile from "./pages/profile";
import Game from "./pages/game";
import Home from "./pages/home";
import OtherUser from "./pages/otherUser";
import Navbar from "./components/navbar";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Container } from "@mui/material";

function App() {
    // See this tutorial for info on how to use react router (they recently changed the entire API in v6).
    // https://reactrouter.com/en/dev/start/tutorial

    const Root = () => {
        return (
            <>
                <Navbar></Navbar>
                <Container sx={{ mt: 2 }}>
                    <Outlet></Outlet>
                </Container>
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
                {
                    path: "profile/:id",
                    element: <OtherUser></OtherUser>,
                },
                {
                    path: "game",
                    element: <Game></Game>,
                },
            ],
        },
    ]);

    return (
        <Provider store={store}>
            <RouterProvider router={router}>
                <Navbar></Navbar>
            </RouterProvider>
        </Provider>
    );
}

export default App;
