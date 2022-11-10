import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
    const [gameId, setGameId] = useState("");
    return (
        <>
            <Typography variant="h3">Enter the game ID here:</Typography>
            <TextField onChange={(e) => setGameId(e.target.value)} placeholder="Game ID" required />
            <Button variant="contained" component={Link} to={`/game/${gameId}`}>
                Join
            </Button>
        </>
    );
}

export default Home;
