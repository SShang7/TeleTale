import { Button } from "@mui/material";
import React from "react";
import Login from "./pages/login";
import Profile from "./pages/profile";

function App() {
    return (
        <React.Fragment>
            <Login />
            <Button variant="contained" href="http://localhost:8000/api/v1/auth/logout">
                Logout
            </Button>
            <Profile />
        </React.Fragment>
    );
}

export default App;
