import { combineReducers } from "@reduxjs/toolkit";
import createPostReducer from "./createPost";
import deletePostReducer from "./deletePost";
import loginReducer from "./login";
import registrationReducer from "./registration";
import userReducer from "./user";

export default combineReducers({
	login: loginReducer,
	registration: registrationReducer,
	user: userReducer,
	createPost: createPostReducer,
	deletePost: deletePostReducer,
});
