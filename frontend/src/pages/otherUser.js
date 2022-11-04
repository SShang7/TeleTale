import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../components/userProfile";

export default function OtherUser() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/users/profile/${id}`
                );
                setProfile({ valid: true, ...response.data });
            } catch {
                setProfile({ valid: false });
            }
        }

        fetchUser();
    }, [id]);

    if (!profile) {
        return <CircularProgress></CircularProgress>;
    }
    if (!profile.valid) {
        return <Typography variant="h4">User could not be found.</Typography>;
    }
    return <UserProfile profile={profile}></UserProfile>;
}
