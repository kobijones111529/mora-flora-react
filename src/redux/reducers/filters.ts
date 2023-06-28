import { createSlice } from "@reduxjs/toolkit";
import { Filters, LocationFilter } from "../../../../types/filters";

const initialState = (): Filters => ({});

const filtersSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		clear: () => ({}),
		setLocationFilter: (state, action: { payload: LocationFilter | null }) => {
			if (action.payload) {
				state.location = action.payload;
			} else {
				delete state.location;
			}
		},
	},
});

export const { clear, setLocationFilter } = filtersSlice.actions;

export default filtersSlice.reducer;
