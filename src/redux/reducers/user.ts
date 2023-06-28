import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../../types/user";

type UserState =
	| { tag: "None" }
	| { tag: "Loading" }
	| { tag: "Some"; user: User }
	| { tag: "Error"; error: string };

const initialState = (): UserState => ({ tag: "None" });

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clear: (_) => ({ tag: "None" }),
		loading: (_) => ({ tag: "Loading" }),
		set: (_, action: { payload: User }) => ({
			tag: "Some",
			user: action.payload,
		}),
		error: (_, action: { payload: string }) => ({
			tag: "Error",
			error: action.payload,
		}),
	},
});

export const { clear, loading, set, error } = userSlice.actions;

export default userSlice.reducer;
