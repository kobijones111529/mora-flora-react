import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { fetchUser as fetchUser } from "./user";
import { clear as unsetUser } from "../reducers/user";
import {
	clear as clearLoginError,
	unspecified as loginError,
} from "../reducers/errors/login";
import { LoginCredentials } from "../../../../types/user";

const qualifiedName = (name: string) => `saga/${name}`;

const sagas = {
	login: {
		type: qualifiedName("login"),
		saga: function* ({
			payload: credentials,
		}: {
			type: string;
			payload: LoginCredentials;
		}) {
			try {
				yield put(clearLoginError());
				yield axios.post("/api/user/login", credentials, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				});
				yield put(fetchUser());
			} catch (err) {
				console.error("uh oh");
				yield put(loginError());
			}
		},
	},
	logout: {
		type: qualifiedName("logout"),
		saga: function* () {
			try {
				yield axios.post("/api/user/logout", {
					withCredentials: true,
				});
				yield put(unsetUser());
			} catch (err) {
				console.error(err);
			}
		},
	},
};

export const login = (credentials: LoginCredentials) => ({
	type: sagas.login.type,
	payload: credentials,
});

export const logout = () => ({ type: sagas.logout.type });

export default function* () {
	yield takeLatest(sagas.login.type, sagas.login.saga);
	yield takeLatest(sagas.logout.type, sagas.logout.saga);
}
