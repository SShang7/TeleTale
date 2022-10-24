import { configureStore } from "@reduxjs/toolkit";
import userProfile from "./reducers";

const store = configureStore({ reducer: userProfile });

export default store;
