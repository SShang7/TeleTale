import axios from "axios";

const isLoggedIn = (userProfile) => ({
    type: "IS_LOGGED_IN",
    payload: { userProfile },
});

const isNotLoggedIn = () => ({
    type: "IS_NOT_LOGGED_IN",
});

export const fetchIsLoggedIn = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/users/profile/", {
                withCredentials: true,
            });
            dispatch(isLoggedIn(response.data));
        } catch (e) {
            dispatch(isNotLoggedIn());
        }
    };
};
