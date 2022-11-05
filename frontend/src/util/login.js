import { googleLoginRoute } from "./backendRoutes";
import { GOOGLE_CLIENT_ID, GOOGLE_OAUTH_SCOPE, GOOGLE_OAUTH_URL } from "./constants";

const showGoogleLogin = () => {
    const urlParams = new URLSearchParams({
        response_type: "code",
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: googleLoginRoute(),
        prompt: "select_account",
        access_type: "offline",
        scope: GOOGLE_OAUTH_SCOPE,
    }).toString();

    window.location = `${GOOGLE_OAUTH_URL}?${urlParams}`;
};

export { showGoogleLogin };
