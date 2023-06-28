import React, { useEffect } from "react";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
	Outlet,
} from "react-router-dom";

import Nav from "../Nav/Nav";

import Feed from "../Posts/Feed/Feed";
import UserPosts from "../Posts/UserPosts/ViewUserPosts/UserPosts";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";

import "./App.css";
import ViewUserPost from "../Posts/UserPosts/ViewUserPost/ViewUserPost";
import CreatePost from "../Posts/UserPosts/CreatePost/CreatePost";
import { fetchUser as fetchUser } from "../../redux/sagas/user";
import EditUserPost from "../Posts/UserPosts/EditPost/EditPost";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import styles from "./App.module.css";

function App() {
	const dispatch = useAppDispatch();

	const user = useAppSelector((store) => store.user);

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<div className={styles["app-container"]}>
					<div className={styles["app-content"]}>
						<Outlet />
					</div>
					<Nav />
				</div>
			),
			children: [
				{
					path: "",
					element: <Navigate replace to="feed" />,
				},
				{
					path: "feed",
					element: <Feed />,
				},
				{
					path: "posts",
					element: user.tag !== "Some" ? <LoginPage /> : <UserPosts />,
				},
				{
					path: "posts/new",
					element: user.tag !== "Some" ? <LoginPage /> : <CreatePost />,
				},
				{
					path: "posts/:id",
					element: user.tag !== "Some" ? <LoginPage /> : <ViewUserPost />,
				},
				{
					path: "posts/:id/edit",
					element: user.tag !== "Some" ? <LoginPage /> : <EditUserPost />,
				},
				{
					path: "login",
					element:
						user.tag === "Some" ? (
							<Navigate replace to="/feed" />
						) : (
							<LoginPage />
						),
				},
				{
					path: "register",
					element:
						user.tag === "Some" ? (
							<Navigate replace to="/feed" />
						) : (
							<RegisterPage />
						),
				},
			],
		},
	]);

	useEffect(() => {
		dispatch(fetchUser());
	}, [dispatch]);

	return (
		<RouterProvider router={router} />
		// <Router>
		// 	<div className={styles["app-container"]}>
		// 		<div className={styles["app-content"]}>
		// 			<Switch>
		// 				<Redirect exact from="/" to="/feed" />

		// 				<Route exact path="/feed">
		// 					<Feed />
		// 				</Route>

		// 				<ProtectedRoute exact path="/posts">
		// 					<UserPosts />
		// 				</ProtectedRoute>

		// 				<ProtectedRoute exact path="/posts/new">
		// 					<CreatePost />
		// 				</ProtectedRoute>

		// 				<ProtectedRoute exact path="/posts/:id">
		// 					<ViewUserPost />
		// 				</ProtectedRoute>

		// 				<ProtectedRoute exact path="/posts/:id/edit">
		// 					<EditUserPost />
		// 				</ProtectedRoute>

		// 				<Route exact path="/login">
		// 					{user.tag === "Some" ? (
		// 						// If the user is already logged in,
		// 						// redirect to the /user page
		// 						<Redirect to="/feed" />
		// 					) : (
		// 						// Otherwise, show the login page
		// 						<LoginPage />
		// 					)}
		// 				</Route>

		// 				<Route exact path="/registration">
		// 					{user.tag === "Some" ? (
		// 						// If the user is already logged in,
		// 						// redirect them to the /user page
		// 						<Redirect to="/" />
		// 					) : (
		// 						// Otherwise, show the registration page
		// 						<RegisterPage />
		// 					)}
		// 				</Route>

		// 				{/* If none of the other routes matched, we will show a 404. */}
		// 				<Route>
		// 					<h1>404</h1>
		// 				</Route>
		// 			</Switch>
		// 		</div>
		// 		<Nav />
		// 	</div>
		// </Router>
	);
}

export default App;
