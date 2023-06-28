import axios, { AxiosResponse } from "axios";
import { put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	pending as pendingDeletePost,
	success as deletePostSuccess,
	error as deletePostError,
} from "../reducers/errors/deletePost";
import {
	error as postsError,
	loading as loadingPosts,
	set as setPosts,
} from "../reducers/posts";
import {
	error as createPostError,
	pending as pendingCreatePost,
	success as createPostSuccess,
} from "../reducers/errors/createPost";
import { Filters, Query } from "../../../../types/filters";
import { EditPost, NewPost, Post } from "../../../../types/posts";

const qualifiedName = (name: string) => `saga/posts/${name}`;

const sagas = {
	fetchPosts: {
		type: qualifiedName("fetch"),
		saga: function* ({ payload: filters }: { type: string; payload: Filters }) {
			try {
				yield put(loadingPosts());

				const query: Query = {
					...(filters.location && { latitude: filters.location.center[0] }),
					...(filters.location && { longitude: filters.location.center[1] }),
					...(filters.location?.distance && {
						distance: filters.location.distance,
					}),
				};

				const { data: posts }: AxiosResponse<Post[]> = yield axios.get(
					"/api/posts",
					{
						params: query,
					}
				);
				yield put(setPosts(posts));
			} catch (err) {
				yield put(postsError("error"));
				console.error(err);
			}
		},
	},
	fetchUserPosts: {
		type: qualifiedName("user/fetch"),
		saga: function* () {
			try {
				yield put(loadingPosts());
				const { data: posts }: AxiosResponse<Post[]> = yield axios.get(
					"/api/user/posts"
				);
				yield put(setPosts(posts));
			} catch (err) {
				yield put(postsError("error"));
				console.error(err);
			}
		},
	},
	postNewPost: {
		type: qualifiedName("new"),
		saga: function* ({ payload: data }: { type: string; payload: NewPost }) {
			yield put(pendingCreatePost());
			try {
				yield axios.post("/api/posts", data, {
					withCredentials: true,
				});
			} catch (err) {
				console.error(err);
				if (axios.isAxiosError(err)) {
					switch (err.response?.status) {
						case 401:
							yield put(createPostError("unauthenticated"));
							break;
						default:
							yield put(createPostError("unspecified"));
					}
				} else {
					yield put(createPostError("unspecified"));
				}
			}
			yield put(createPostSuccess());
		},
	},
	editPost: {
		type: qualifiedName("edit"),
		saga: function* ({
			payload: { id, data },
		}: {
			type: string;
			payload: { id: number; data: EditPost };
		}) {
			try {
				yield axios.patch(`/api/posts/${id}`, data, {
					withCredentials: true,
				});
			} catch (err) {
				console.error(err);
			}
		},
	},
	deletePost: {
		type: qualifiedName("delete"),
		saga: function* ({
			payload: { id },
		}: {
			type: string;
			payload: { id: number };
		}) {
			yield put(pendingDeletePost(id));
			try {
				yield axios.delete(`/api/posts/${id}`, {
					withCredentials: true,
				});
			} catch (err) {
				if (axios.isAxiosError(err)) {
					console.error(err);
					switch (err.response?.status) {
						case 401:
							yield put(deletePostError({ id, error: "unauthenticated" }));
							break;
						case 403:
							yield put(deletePostError({ id, error: "unauthorized" }));
							break;
						case 404:
							yield put(deletePostError({ id, error: "not_found" }));
							break;
						default:
							yield put(deletePostError({ id, error: "unspecified" }));
					}
				} else {
					yield put(deletePostError({ id, error: "unspecified" }));
				}
			}
			yield put(deletePostSuccess(id));
		},
	},
};

export const fetchPosts = (filters: Filters) => ({
	type: sagas.fetchPosts.type,
	payload: filters,
});
export const fetchUserPosts = () => ({ type: sagas.fetchUserPosts.type });
export const postNewPost = (post: NewPost) => ({
	type: sagas.postNewPost.type,
	payload: post,
});
export const editPost = (id: number, data: EditPost) => ({
	type: sagas.editPost.type,
	payload: { id, data },
});
export const deletePost = (id: number) => ({
	type: sagas.deletePost.type,
	payload: { id },
});

export default function* () {
	yield takeLatest(sagas.fetchPosts.type, sagas.fetchPosts.saga);
	yield takeLatest(sagas.fetchUserPosts.type, sagas.fetchUserPosts.saga);
	yield takeEvery(sagas.postNewPost.type, sagas.postNewPost.saga);
	yield takeEvery(sagas.editPost.type, sagas.editPost.saga);
	yield takeEvery(sagas.deletePost.type, sagas.deletePost.saga);
}
