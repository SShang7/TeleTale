import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Paper,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    MenuItem,
    Select,
    TextField,
    Typography,
    TextareaAutosize,
} from "@mui/material";
import { useSelector } from "react-redux";
import { showGoogleLogin } from "../util/login";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Link } from "react-router-dom";
import { playGameRoute } from "../util/backendRoutes";
import {
    Avatar,
    ChatContainer,
    ConversationHeader,
    Message,
    MessageInput,
    MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

function Game() {
    const { id } = useParams();
    const socketUrl = playGameRoute(id);
    const profile = useSelector((state) => state);

    const [gameState, setGameState] = useState(null);
    const [phrase, setPhrase] = useState("");
    const [hasCopiedId, sethasCopiedId] = useState(false);
    const [hasWebsocketError, setHasWebsocketError] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [phraseImages, setPhraseImages] = useState({});
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl, {
        onError: () => setHasWebsocketError(!!profile && profile.isLoggedIn),
    });

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
            if (data.command === "chat") {
                setMessageList((messages) => [...messages, data]);
            } else if (data.command === "updatePhrase") {
                setPhraseImages((phraseImages) => ({
                    [`${data.roundNumber}-${data.turnNumber}`]: data.imageUrl,
                    ...phraseImages,
                }));
            } else if (data.hasOwnProperty("gameState")) {
                setGameState(data.gameState);
            }
        }
    }, [lastJsonMessage, setGameState, setPhraseImages]);

    if (hasWebsocketError) {
        return (
            <Typography variant="h6">
                Unable to connect to the game. Make sure the specified game ID is correct!
            </Typography>
        );
    }
    if (!profile || (profile.isLoggedIn && !gameState)) {
        // Show loading screen if profile data or game state is being fetched
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h2">{owner}'s Lobby</Typography>
                <Box sx={{ py: 1 }} />
                <Box sx={{ display: "flex" }}>
                    {gameIdDisplay()}
                    <Box sx={{ px: 1 }} />
                    {gameModeSelection()}
                </Box>
                <Box sx={{ py: 1 }} />
                <Paper variant="outlined" elevation={4}>
                    {playerList()}
                </Paper>
                <Box sx={{ py: 1 }} />
                <Box sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            window.location = "/";
                        }}
                    >
                        Leave Lobby
                    </Button>
                    <Box sx={{ px: 1 }} />
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
                </Box>
            </Box>
        );
    };

    const formatChatMessages = () => {
        return messageList.map((x) => {
            return (
                <Message
                    model={{
                        message: x.message,
                        sender: x.sender.display_name,
                    }}
                >
                    <Avatar src={x.sender.profile_pic} name={x.sender.display_name}></Avatar>
                </Message>
            );
        });
    };

    const chat = () => {
        return (
            <ChatContainer style={{ height: "50vh" }}>
                <ConversationHeader>
                    <ConversationHeader.Content info="Chat with other players!" />
                </ConversationHeader>
                <MessageList>{formatChatMessages()}</MessageList>
                <MessageInput
                    placeholder="Type your message here"
                    attachButton={false}
                    onChange={setMessage}
                    onSend={() => {
                        sendJsonMessage({
                            command: "chat",
                            message,
                        });
                    }}
                />
            </ChatContainer>
        );
    };

    const game = () => {
        if (gameState.gameStatus !== "In Progress") {
            return <></>;
        }

        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <Typography variant="h2">Round {gameState.currentRound}</Typography>
                {profile.id === gameState.currentPlayer.id ? (
                    <>
                        <Typography variant="h5">It's your turn! Your prompt is:</Typography>
                        <Box sx={{ pt: 1 }} />
                        <Typography
                            variant="body1"
                            style={{ width: "100%", wordWrap: "break-word" }}
                        >
                            <em>{gameState.prompt}</em>
                        </Typography>
                        <Box sx={{ pt: 1 }} />
                        <TextareaAutosize
                            value={phrase}
                            style={{ width: "100%", resize: "vertical" }}
                            onChange={(e) => setPhrase(e.target.value)}
                            variant="outlined"
                            placeholder="Enter your phrase!"
                            multiline
                            minRows={4}
                        ></TextareaAutosize>
                        <Box sx={{ pt: 1 }} />
                        <Button
                            variant="contained"
                            onClick={() => {
                                setPhrase("");
                                sendJsonMessage({
                                    command: "submit",
                                    phrase,
                                });
                            }}
                        >
                            Submit
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body1">
                            <em>It is currently {gameState.currentPlayer.display_name}'s turn.</em>
                        </Typography>
                    </>
                )}
            </Box>
        );
    };

    const results = () => {
        return (
            <>
                <Typography variant="h2">Your story has been told:</Typography>
                {gameState.phrases.map((phrase) => {
                    const imageUrl =
                        phraseImages[`${phrase.roundNumber}-${phrase.turnNumber}`] ?? "";
                    return (
                        <>
                            {phrase.turnNumber === 1 && (
                                <>
                                    <hr />
                                    <Typography variant="h4">Round {phrase.roundNumber}</Typography>
                                </>
                            )}
                            <Paper
                                variant="outlined"
                                sx={{ display: "flex", my: 2, padding: 1, minHeight: "350px" }}
                            >
                                <Typography
                                    variant="body1"
                                    style={{ width: "48%", "word-wrap": "break-word" }}
                                >
                                    <strong>{phrase.author}:</strong> {phrase.phrase}
                                </Typography>
                                {imageUrl !== "" ? (
                                    <img
                                        style={{
                                            marginLeft: "auto",
                                            width: "48%",
                                            maxHeight: "336px", // this should be set to what the generated image size is fixed to
                                        }}
                                        src={imageUrl}
                                        alt={phrase.phrase}
                                    ></img>
                                ) : (
                                    <CircularProgress
                                        sx={{
                                            marginLeft: "auto",
                                        }}
                                    />
                                )}
                            </Paper>
                        </>
                    );
                })}
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
                return results();
            default:
                return <Typography variant="h2">Oops! Something went wrong on our end.</Typography>;
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    {display()}
                </Grid>
                <Grid item xs={4}>
                    {chat()}
                </Grid>
            </Grid>
        </Box>
    );
}

export default Game;
