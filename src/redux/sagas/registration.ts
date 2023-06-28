import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";
import { RegistrationCredentials } from "../../../../types/user";
import { login } from "./login";

const qualifiedName = (name: string) => `saga/${name}`;

const sagas = {
	register: {
		type: qualifiedName("register"),
		saga: function* ({
			payload: credentials,
		}: {
			type: string;
			payload: RegistrationCredentials;
		}) {
			try {
				yield axios.post("/api/user/register", credentials);
				yield put(login(credentials));
			} catch (err) {
				console.error(err);
			}
		},
	},
};

export const register = (credentials: RegistrationCredentials) => ({
	type: sagas.register.type,
	payload: credentials,
});

export default function* () {
	yield takeEvery(sagas.register.type, sagas.register.saga);
}
