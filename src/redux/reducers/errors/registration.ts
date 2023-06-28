import { createSlice } from "@reduxjs/toolkit";

const qualifiedName = (name: string) => `errors/${name}`;

type Error = "invalid_input" | "unspecified";

const initialState = (): Error | null => null;

const registrationSlice = createSlice({
	name: qualifiedName("registration"),
	initialState,
	reducers: {
		clear: () => null,
		invalidInput: (_) => "invalid_input",
		unspecified: (_) => "unspecified",
	},
});

export const { clear, invalidInput, unspecified } = registrationSlice.actions;

export default registrationSlice.reducer;
