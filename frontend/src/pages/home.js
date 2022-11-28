import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
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
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
            <Typography variant="h6">Join a game! Enter the game ID below.</Typography>
            <Box sx={{ py: 1 }} />
            <Box sx={{ display: "flex", alignItems: "start" }}>
                <TextField
                    error={!!gameId && gameId.length !== 10}
                    helperText={errorMessage}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Game ID"
                    sx={{ width: 300 }}
                    required
                />
                <Box sx={{ px: 1 }} />
                <Button
                    variant="contained"
                    component={Link}
                    to={`/game/${gameId}`}
                    sx={{ width: 64 }}
                    disabled={!!errorMessage}
                >
                    Join
                </Button>
            </Box>
        </Box>
    );
}

export default Home;
