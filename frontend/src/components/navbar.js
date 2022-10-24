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
import { Link as RouterLink, useNavigate } from "react-router-dom";

function Navbar() {
    // This code snippet is heavily inspired by this part of the react MUI docs.
    // https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();

    const pages = [{ name: "Profile", link: "/profile" }];
    const settings = ["Profile", "Logout"];

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

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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
                        {pages.map(({ name, link }) => (
                            <Button
                                key={name}
                                onClick={handleCloseNavMenu(link)}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                {name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
