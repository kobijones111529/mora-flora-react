import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../../../types/posts";

type PostsState =
	| { tag: "None" }
	| { tag: "Loading" }
	| { tag: "Some"; posts: Post[] }
	| { tag: "Error"; error: string };

const initialState = (): PostsState => ({ tag: "None" });

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		clear: (_) => ({ tag: "None" }),
		loading: (_) => ({ tag: "Loading" }),
		set: (_, action: { payload: Post[] }) => ({
			tag: "Some",
			posts: [...action.payload],
		}),
		error: (_, action: { payload: string }) => ({
			tag: "Error",
			error: action.payload,
		}),
	},
});

export const { clear, loading, set, error } = postsSlice.actions;

export default postsSlice.reducer;
