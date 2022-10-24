const GOOGLE_CLIENT_ID = "849403314603-mvd4aatp6nr33ri438t2kq3h2n6evo9p.apps.googleusercontent.com";

const showGoogleLogin = () => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirectUri = "api/v1/auth/login/google/";

    const scope = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ");

    const urlParams = new URLSearchParams({
        response_type: "code",
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `http://localhost:8000/${redirectUri}`,
        prompt: "select_account",
        access_type: "offline",
        scope,
    }).toString();

    window.location = `${googleAuthUrl}?${urlParams}`;
};

export { showGoogleLogin };
