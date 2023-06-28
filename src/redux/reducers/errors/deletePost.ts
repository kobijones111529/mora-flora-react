import { createSlice } from "@reduxjs/toolkit";
import { Status } from "./status";

type DeleteError =
	| "not_found"
	| "unauthenticated"
	| "unauthorized"
	| "unspecified";

const qualifiedName = (name: string) => `errors/post/${name}`;

const initialState = (): { id: number; status: Status<DeleteError> }[] => [];

const deletePostSlice = createSlice({
	name: qualifiedName("delete"),
	initialState,
	reducers: {
		clearAll: () => [],
		clear: (state, { payload: id }: { payload: number }) => {
			const index = state.findIndex((elem) => elem.id === id);
			state.splice(index, 1);
		},
		pending: (state, { payload: id }: { payload: number }) => {
			const elem = state.find((elem) => elem.id === id);
			if (elem) {
				elem.status = { tag: "pending" };
			} else {
				state.push({ id, status: { tag: "pending" } });
			}
		},
		success: (state, { payload: id }: { payload: number }) => {
			const elem = state.find((elem) => elem.id === id);
			if (elem) {
				elem.status = { tag: "success" };
			} else {
				state.push({ id, status: { tag: "success" } });
			}
		},
		error: (
			state,
			{
				payload: { id, error },
			}: { payload: { id: number; error: DeleteError } }
		) => {
			const elem = state.find((elem) => elem.id === id);
			if (elem) {
				elem.status = { tag: "error", error };
			} else {
				state.push({ id, status: { tag: "error", error } });
			}
		},
	},
});

export const { clearAll, clear, pending, success, error } =
	deletePostSlice.actions;

export default deletePostSlice.reducer;
