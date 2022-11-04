import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    List,
    ListItemButton,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { showGoogleLogin } from "../helpers";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

function Lobby() {
    // TODO: generate game ID
    const socketUrl = "ws://localhost:8000/ws/play/abcdef";
    const profile = useSelector((state) => state);

    function profileExists() {
        if (!profile || !profile.isLoggedIn) return "Debug";
        return profile.name;
    }

    // eslint-disable-next-line no-unused-vars
    const [owner, setOwner] = useState(profileExists);
    const [gameState, setGameState] = useState(null);
    const { sendMessage, lastMessage } = useWebSocket(socketUrl);

    useEffect(() => {
        sendMessage(
            JSON.stringify({
                command: "join",
            })
        );
    }, [sendMessage]);

    useEffect(() => {
        if (lastMessage) {
            const data = JSON.parse(lastMessage.data);
            if (data.hasOwnProperty("gameState")) {
                setGameState(data.gameState);
            }
        }
    }, [lastMessage, setGameState]);

    if (!profile) {
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

        return (
            <List>
                {gameState.allPlayers.map((p, index) => (
                    <ListItemButton key={index}>
                        Player {index + 1}: {p.display_name}
                    </ListItemButton>
                ))}
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
    return (
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Typography variant="h2">{owner}'s Lobby</Typography>
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
            <Button variant="contained">Start Game</Button>
        </Box>
    );
}

export default Lobby;
