import { Avatar, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await axios.get("http://localhost:8000/api/v1/users/profile/", {
                withCredentials: true,
            });
            setProfile(response.data);
        })();
    }, []);

    if (!profile) {
        return <CircularProgress />;
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
