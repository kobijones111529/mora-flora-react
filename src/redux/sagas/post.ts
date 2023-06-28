import axios from "axios";
import { AxiosResponse } from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { Post } from "../../../../types/posts";
import {
	set as setPost,
	loading as loadingPost,
	error as postError,
} from "../reducers/post";

const qualifiedName = (name: string) => `saga/post/${name}`;

const sagas = {
	fetchPost: {
		type: qualifiedName("fetch"),
		saga: function* ({ payload: id }: { type: string; payload: number }) {
			try {
				yield put(loadingPost());
				const { data: post }: AxiosResponse<Post> = yield axios.get(
					`/api/posts/${id}`
				);
				yield put(setPost(post));
			} catch (err) {
				yield put(postError("error"));
			}
		},
	},
};

export const fetchPost = (id: number) => ({
	type: sagas.fetchPost.type,
	payload: id,
});

export default function* () {
	yield takeLatest(sagas.fetchPost.type, sagas.fetchPost.saga);
}
