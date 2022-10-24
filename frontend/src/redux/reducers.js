const userProfile = (state = null, action) => {
    switch (action.type) {
        case "IS_LOGGED_IN":
            return { isLoggedIn: true, ...action.payload.userProfile };
        case "IS_NOT_LOGGED_IN":
            return { isLoggedIn: false };
        default:
            return state;
    }
};

export default userProfile;
