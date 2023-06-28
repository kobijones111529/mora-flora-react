import { createSlice } from "@reduxjs/toolkit";
import { Status } from "./status";

type CreateError = "unauthenticated" | "unspecified";

const qualifiedName = (name: string) => `errors/post/${name}`;

const initialState = (): Status<CreateError> | null => null;

const createPostSlice = createSlice({
	name: qualifiedName("create"),
	initialState,
	reducers: {
		clear: () => null,
		success: (_) => ({ tag: "success" }),
		pending: (_) => ({ tag: "pending" }),
		error: (_, action: { payload: CreateError }) => ({
			tag: "error",
			error: action.payload,
		}),
	},
});

export const { clear, success, pending, error } = createPostSlice.actions;

export default createPostSlice.reducer;
