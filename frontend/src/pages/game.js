import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { showGoogleLogin } from "../helpers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Link } from "react-router-dom";

function Game() {
    const { id } = useParams();
    const socketUrl = `ws://localhost:8000/ws/play/${id}`;
    const profile = useSelector((state) => state);

    const [gameState, setGameState] = useState(null);
    const [hasCopiedId, sethasCopiedId] = useState(false);
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

    // Send join message on page load
    useEffect(() => {
        sendJsonMessage({
            command: "join",
        });
    }, [sendJsonMessage]);

    // Update game state upon receiving a message from the web socket
    useEffect(() => {
        if (lastJsonMessage) {
            const data = lastJsonMessage;
            if (data.hasOwnProperty("gameState")) {
                setGameState(data.gameState);
            }
        }
    }, [lastJsonMessage, setGameState]);

    if (!profile || !gameState) {
        return <CircularProgress />;
    }
    if (!profile.isLoggedIn) {
        showGoogleLogin();
        return <></>;
    }

    const playerList = () => {
        if (!gameState) {
            return <List></List>;
        }

        const listItemParts = (p) => {
            return profile.id === p.id
                ? [ListItem, {}]
                : [ListItemButton, { component: Link, to: `/profile/${p.id}`, target: "_blank" }];
        };
        return (
            <List>
                {gameState.allPlayers.map((p, index) => {
                    const [ListItemComponent, props] = listItemParts(p);
                    return (
                        <ListItemComponent key={p.display_name} {...props}>
                            Player {index + 1}: {p.display_name}
                        </ListItemComponent>
                    );
                })}
            </List>
        );
    };

    const gameModeSelection = () => {
        return (
            <FormControl>
                <InputLabel id="game-mode-list">Mode</InputLabel>
                <Select defaultValue="Casual" labelId="game-mode-list" label="Mode">
                    <MenuItem value="Blitz">Blitz</MenuItem>
                    <MenuItem value="Casual">Casual</MenuItem>
                </Select>
            </FormControl>
        );
    };

    const gameIdDisplay = () => {
        const label = !hasCopiedId ? "Click to copy Game ID" : "Copied!";
        return (
            <>
                <TextField
                    defaultValue={id}
                    label={label}
                    onClick={() => {
                        navigator.clipboard.writeText(id);
                        sethasCopiedId(true);
                    }}
                    disabled
                />
            </>
        );
    };

    const owner = gameState.owner?.display_name;
    const lobby = () => {
        return (
            <>
                <Typography variant="h2">{owner}'s Lobby</Typography>
                {gameIdDisplay()}
                {gameModeSelection()}
                {playerList()}
                <Button
                    variant="contained"
                    onClick={() => {
                        window.location = "/";
                    }}
                >
                    Leave Lobby
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        sendJsonMessage({
                            command: "start",
                        });
                    }}
                >
                    Start Game
                </Button>
            </>
        );
    };

    const game = () => {
        if (gameState.gameStatus !== "In Progress") {
            return <></>;
        }

        return (
            <>
                <Typography variant="h2">Round {gameState.currentRound}</Typography>
                {profile.id === gameState.currentPlayer.id ? (
                    <>
                        <Typography>It's your turn! Your prompt is:</Typography>
                        <Typography>{gameState.prompt}</Typography>

                        <TextField variant="outlined" multiline rows={2}></TextField>
                        <Button
                            variant="contained"
                            onClick={() => {
                                sendJsonMessage({
                                    command: "submit",
                                    phrase: "PLACEHOLDER PHRASE TEXT",
                                });
                            }}
                        >
                            Submit
                        </Button>
                    </>
                ) : (
                    <Typography>
                        It is currently {gameState.currentPlayer.display_name}'s turn.
                    </Typography>
                )}
            </>
        );
    };

    const display = () => {
        switch (gameState.gameStatus) {
            case "Created":
                return lobby();
            case "In Progress":
                return game();
            case "Finished":
                return <Typography variant="h2">The game has ended.</Typography>;
            default:
                return <Typography variant="h2">Oops! Something went wrong on our end.</Typography>;
        }
    };

    return <Box sx={{ width: "100%", bgcolor: "background.paper" }}>{display()}</Box>;
}

export default Game;
