import { createSlice } from "@reduxjs/toolkit";

const qualifiedName = (name: string) => `errors/${name}`;

const initialState = ():
	| "invalid_input"
	| "authentication_failed"
	| "unspecified"
	| null => null;

const loginSlice = createSlice({
	name: qualifiedName("login"),
	initialState,
	reducers: {
		clear: () => null,
		invalidInput: (_) => "invalid_input",
		authenticationFailed: (_) => "authentication_failed",
		unspecified: (_) => "unspecified",
	},
});

export const { clear, invalidInput, authenticationFailed, unspecified } =
	loginSlice.actions;

export default loginSlice.reducer;
