import { useState } from "react";
import {
    AppBar,
    Container,
    Toolbar,
    Typography,
    Box,
    Menu,
    Button,
    Tooltip,
    Avatar,
    MenuItem,
    IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { showGoogleLogin } from "../util/login";
import { createGameRoute, logoutRoute } from "../util/backendRoutes";
import axios from "axios";

function Navbar() {
    // This code snippet is heavily inspired by this part of the react MUI docs.
    // https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu

    // eslint-disable-next-line no-unused-vars
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (link) => {
        return () => {
            setAnchorElNav(null);
            navigate(link);
        };
    };

    const handleCloseUserMenu = (onClick) => {
        return () => {
            setAnchorElUser(null);
            onClick();
        };
    };

    const profile = useSelector((state) => state);

    const pages = [
        {
            name: "Create Game",
            onClick: () => {
                if (!profile || !profile.isLoggedIn) {
                    return showGoogleLogin;
                }

                return async () => {
                    const response = await axios.post(createGameRoute(), {
                        withCredentials: true,
                    });
                    navigate(`/game/${response.data.gameId}`);
                };
            },
        },
        { name: "Profile", onClick: () => handleCloseNavMenu("/profile") },
    ];
    const settings = [
        {
            name: "Profile",
            onClick: () => {
                navigate("/profile");
            },
        },
        {
            name: "Logout",
            onClick: () => {
                window.location = logoutRoute();
            },
        },
    ];

    return (
        <AppBar position="static">
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ mr: 2, color: "inherit", textDecoration: "none" }}
                        component={RouterLink}
                        to="/"
                    >
                        TeleTale
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map(({ name, onClick }) => (
                            <Button
                                key={name}
                                onClick={onClick()}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {profile?.isLoggedIn ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={profile.name} src={profile.profilePicture} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu(() => {})}
                                >
                                    {settings.map(({ name, onClick }) => (
                                        <MenuItem key={name} onClick={handleCloseUserMenu(onClick)}>
                                            <Typography textAlign="center">{name}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Button
                                onClick={showGoogleLogin}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
