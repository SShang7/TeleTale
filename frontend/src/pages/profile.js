import { Avatar, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { showGoogleLogin } from "../helpers";

function Profile() {
    const profile = useSelector((state) => state);

    if (!profile) {
        return <CircularProgress />;
    }
    if (!profile.isLoggedIn) {
        showGoogleLogin();
        return <></>;
    }
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

export default Profile;
