const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const BACKEND_WS_URL = process.env.REACT_APP_BACKEND_WS_URL || "ws://localhost:8000";

const GOOGLE_CLIENT_ID = "849403314603-mvd4aatp6nr33ri438t2kq3h2n6evo9p.apps.googleusercontent.com";

const GOOGLE_OAUTH_SCOPE = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const VALID_GAME_ID = new RegExp("^[a-z]{10}$");

export {
    BACKEND_URL,
    BACKEND_WS_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_OAUTH_SCOPE,
    GOOGLE_OAUTH_URL,
    VALID_GAME_ID,
};
