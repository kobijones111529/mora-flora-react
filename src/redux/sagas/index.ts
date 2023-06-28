import { all } from "redux-saga/effects";
import login from "./login";
import user from "./user";
import posts from "./posts";
import post from "./post";
import registration from "./registration";

export default function* () {
	yield all([login(), registration(), user(), posts(), post()]);
}
