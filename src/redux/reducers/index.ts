import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user";
import postsReducer from "./posts";
import errorsReducer from "./errors";
import postReducer from "./post";
import filtersReducer from "./filters";

export default combineReducers({
	errors: errorsReducer,
	user: userReducer,
	posts: postsReducer,
	post: postReducer,
	filters: filtersReducer,
});
