import { Avatar, Box, Paper, Typography } from "@mui/material";

export default function UserProfile({ profile }) {
    return (
        <Paper sx={{ width: "40%", m: "0 auto", p: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex" }}>
                <Typography variant="h3">{profile.name}</Typography>
                <Avatar sx={{ ml: "auto" }} src={profile.profilePicture} alt={profile.name} />
            </Box>
            <Box sx={{ pt: 1 }} />
            <Typography variant="body2">{profile.bio}</Typography>
        </Paper>
    );
}
