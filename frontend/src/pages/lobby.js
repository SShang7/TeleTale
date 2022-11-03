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
    const socketUrl = "ws://localhost:8000/ws/play/abcdef";

    const profile = useSelector((state) => state);
    function profileExists() {
        if (!profile || !profile.isLoggedIn) return "Debug";
        return profile.name;
    }
    const [owner, setOwner] = useState(profileExists);
    const [players, setPlayers] = useState([owner, "placeholder"]);

    const [gameState, setGameState] = useState({});

    useEffect(() => {
        sendMessage(
            JSON.stringify({
                command: "join",
            })
        );
    });

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    useEffect(() => {
        console.log(lastMessage);
        // setGameState();
    }, [lastMessage, setGameState]);

    if (!profile) {
        return <CircularProgress />;
    }
    if (!profile.isLoggedIn) {
        showGoogleLogin();
        return <></>;
    }
    const playerList = () => {
        return (
            <List>
                {players.map((p, index) => (
                    <ListItemButton key={index}>
                        Player {index + 1}: {p}
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
            <Button variant="contained">Leave Lobby</Button>
            <Button variant="contained">Start Game</Button>
        </Box>
    );
}

export default Lobby;
