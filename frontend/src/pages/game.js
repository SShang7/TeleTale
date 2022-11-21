import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
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
import { showGoogleLogin } from "../util/login";
import { useEffect, useState } from "react";
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
// eslint-disable-next-line no-unused-vars
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

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
                setPhraseImages({
                    [`${data.roundNumber}-${data.turnNumber}`]: data.imageUrl,
                    ...phraseImages,
                });
            } else if (data.hasOwnProperty("gameState")) {
                setGameState(data.gameState);
            }
        }
    }, [lastJsonMessage, setGameState, phraseImages, setPhraseImages]);

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
            <>
                <Typography variant="h2">Round {gameState.currentRound}</Typography>
                {profile.id === gameState.currentPlayer.id ? (
                    <>
                        <Typography>It's your turn! Your prompt is:</Typography>
                        <Typography>{gameState.prompt}</Typography>

                        <TextField
                            value={phrase}
                            onChange={(e) => setPhrase(e.target.value)}
                            variant="outlined"
                            placeholder="Enter your phrase!"
                            multiline
                            rows={2}
                        ></TextField>
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
                    <Typography>
                        It is currently {gameState.currentPlayer.display_name}'s turn.
                    </Typography>
                )}
            </>
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
                                    <Typography variant="h6">Round {phrase.roundNumber}</Typography>
                                </>
                            )}
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body1">
                                    {phrase.author}: {phrase.phrase}
                                </Typography>
                                {imageUrl !== "" ? (
                                    <img
                                        style={{ marginLeft: "auto" }}
                                        src={imageUrl}
                                        alt={phrase.phrase}
                                    ></img>
                                ) : (
                                    <CircularProgress sx={{ marginLeft: "auto" }} />
                                )}
                            </div>
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
