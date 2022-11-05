import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import UserProfile from "../components/userProfile";
import { showGoogleLogin } from "../util/login";

function Profile() {
    const profile = useSelector((state) => state);

    if (!profile) {
        return <CircularProgress />;
    }
    if (!profile.isLoggedIn) {
        showGoogleLogin();
        return <></>;
    }
    return <UserProfile profile={profile} />;
}

export default Profile;
