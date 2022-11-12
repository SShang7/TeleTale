import { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { VALID_GAME_ID } from "../util/constants";

function Home() {
    const [gameId, setGameId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!VALID_GAME_ID.test(gameId)) {
            setErrorMessage("The game ID should consist of 10 lowercase alphabetic characters.");
        } else {
            setErrorMessage("");
        }
    }, [gameId]);

    return (
        <>
            <Typography variant="h6">Join via game ID:</Typography>
            <TextField
                error={!!gameId && gameId.length !== 10}
                helperText={errorMessage}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Game ID"
                required
            />
            <Button
                variant="contained"
                component={Link}
                to={`/game/${gameId}`}
                disabled={!!errorMessage}
            >
                Join
            </Button>
        </>
    );
}

export default Home;
