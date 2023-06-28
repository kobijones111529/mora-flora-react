import React, { useEffect } from "react";
import Post from "./Post/Post";
import { fetchPosts } from "../../../redux/sagas/posts";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Filters from "./Filters/Filters";

import styles from "./Feed.module.css";
import { Post as PostT } from "../../../../../types/posts";

function Feed() {
	const dispatch = useAppDispatch();
	const filters = useAppSelector((store) => store.filters);
	const feed = useAppSelector((store) => store.posts);

	useEffect(() => {
		dispatch(fetchPosts(filters));
	}, [filters]);

	const showFeed = () => {
		switch (feed.tag) {
			case "None":
			case "Loading":
				return <p>Loading...</p>;
			case "Some":
				return (
					<ol className={styles["posts-container"]}>
						{feed.posts.map((post: PostT) => (
							<li key={post.id} className={styles["card"]}>
								<Post
									type={post.type}
									plantName={post.plant_name}
									{...(post.image_url && { imageUrl: post.image_url })}
									{...(post.description && { description: post.description })}
									location={{
										latitude: post.latitude,
										longitude: post.longitude,
									}}
									contact={post.contact_url}
								/>
							</li>
						))}
					</ol>
				);
			case "Error":
				return <p>Error loading posts</p>;
			default:
				return <p>{"Something went wrong :("}</p>;
		}
	};

	return (
		<div className={styles["container"]}>
			<Filters />
			{showFeed()}
		</div>
	);
}

export default Feed;
