import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../../../types/posts";

type PostState =
	| { tag: "None" }
	| { tag: "Loading" }
	| { tag: "Some"; post: Post }
	| { tag: "Error"; error: string };

const initialState = (): PostState => ({ tag: "None" });

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		clear: (_) => ({ tag: "None" }),
		loading: (_) => ({ tag: "Loading" }),
		set: (_, action: { payload: Post }) => ({
			tag: "Some",
			post: action.payload,
		}),
		error: (_, action: { payload: string }) => ({
			tag: "Error",
			error: action.payload,
		}),
	},
});

export const { clear, loading, set, error } = postSlice.actions;

export default postSlice.reducer;
