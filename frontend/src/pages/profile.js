import { Avatar, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

function Profile() {
    const profile = useSelector((state) => {
        return state;
    });

    let location = useLocation();

    if (!profile) {
        return <CircularProgress />;
    }
    if (!profile.isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
        <Card style={{ width: "40%", margin: "0 auto" }}>
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
