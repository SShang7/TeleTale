import { BACKEND_URL, BACKEND_WS_URL } from "./constants";

const googleLoginRoute = () => {
    return `${BACKEND_URL}/api/v1/auth/login/google/`;
};

const logoutRoute = () => {
    return `${BACKEND_URL}/api/v1/auth/logout/`;
};

const currentProfileRoute = () => {
    return `${BACKEND_URL}/api/v1/users/profile/`;
};

const userProfileRoute = (userId) => {
    return `${BACKEND_URL}/api/v1/users/profile/${userId}`;
};

const playGameRoute = (gameId) => {
    return `${BACKEND_WS_URL}/ws/play/${gameId}`;
};

export { googleLoginRoute, logoutRoute, currentProfileRoute, userProfileRoute, playGameRoute };
