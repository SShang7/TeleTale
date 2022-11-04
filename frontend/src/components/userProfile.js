import { Avatar, Card, CardContent, Typography } from "@mui/material";

export default function UserProfile({ profile }) {
    return (
        <Card sx={{ width: "40%", margin: "0 auto" }}>
            <CardContent>
                <Avatar src={profile.profilePicture} alt={profile.name} />
                <Typography variant="h3">{profile.name}</Typography>
                <Typography variant="body2">{profile.email}</Typography>
                <Typography variant="body2">{profile.bio}</Typography>
            </CardContent>
        </Card>
    );
}
