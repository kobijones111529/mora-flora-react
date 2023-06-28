import { Link } from "react-router-dom";
import styles from "./Post.module.css";
import React from "react";
import { never } from "../../../../../util/never";

type Props = {
	id: number;
	type: "offer" | "request";
	plantName: string;
	imageUrl?: string;
	description?: string;
	contact: string;
};

function Post({ id, type, plantName, imageUrl, description, contact }: Props) {
	const showPostType = () => {
		switch (type) {
			case "offer":
				return (
					<img
						src="images/price-tag-icon.png"
						className={styles["post-type-icon"]}
					/>
				);
			case "request":
				return (
					<img
						src="images/hand-open.png"
						className={styles["post-type-icon"]}
					/>
				);
			default:
				console.error("Show post type error");
			// return never(type);
		}
	};

	const showDescription = () => {
		if (description) {
			return <p className={styles["description"]}>{description}</p>;
		} else {
			return <></>;
		}
	};

	return (
		<div className={styles.card}>
			<img className={styles.img} src={imageUrl} alt={plantName} />
			<div className={styles["top-row"]}>
				{showPostType()}
				<h3>{plantName}</h3>
			</div>
			{showDescription()}
			<div className={styles["contact"]}>
				<h4>Contact</h4>
				<p>{contact}</p>
			</div>
			<Link to={`/posts/${id}`}>
				<button>View</button>
			</Link>
		</div>
	);
}

export default Post;
