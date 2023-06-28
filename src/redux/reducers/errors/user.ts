import { createSlice } from "@reduxjs/toolkit";

const qualifiedName = (name: string) => `errors/${name}`;

const initialState = (): string | null => null;

const userSlice = createSlice({
	name: qualifiedName("user"),
	initialState,
	reducers: {
		clear: () => null,
		unauthenticated: () => "unauthenticated",
		unspecified: () => "unspecified",
	},
});

export const { clear, unauthenticated, unspecified } = userSlice.actions;

export default userSlice.reducer;
