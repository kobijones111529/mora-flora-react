import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchPost } from "../../../../redux/sagas/post";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { deletePost } from "../../../../redux/sagas/posts";
import { never } from "../../../../util/never";
import { clear as clearDeletePostStatus } from "../../../../redux/reducers/errors/deletePost";

function ViewUserPost() {
	const params = useParams();
	const id = Number(params["id"]);
	const dispatch = useAppDispatch();
	const post = useAppSelector((store) => store.post);
	const deleteError = useAppSelector((store) => store.errors.deletePost);
	const navigate = useNavigate();

	const [awaitingDeleteStatus, setAwaitingDeleteStatus] = useState(false);

	useEffect(() => {
		dispatch(fetchPost(id));
	}, [id]);

	useEffect(() => {
		if (awaitingDeleteStatus) {
			const status = deleteError.find((elem) => elem.id === id);
			if (!status) {
				setAwaitingDeleteStatus(false);
				dispatch(fetchPost(id));
			} else {
				switch (status.status.tag) {
					case "success":
						dispatch(clearDeletePostStatus(id));
						navigate("/posts");
						break;
					case "pending":
						break;
					case "error":
						alert(`Error deleting post: ${status.status.error}`);
						setAwaitingDeleteStatus(false);
						dispatch(clearDeletePostStatus(id));
						break;
					case undefined:
						setAwaitingDeleteStatus(false);
						dispatch(fetchPost(id));
						break;
					default:
						console.error("View user post error");
					// never(status.status);
				}
			}
		}
	}, [deleteError]);

	const handleDelete = () => {
		dispatch(deletePost(id));
		setAwaitingDeleteStatus(true);
	};

	const showPost = () => {
		switch (post.tag) {
			case "None":
			case "Loading":
				return <p>Loading...</p>;
			case "Some": {
				const p = post.post;
				return (
					<>
						{p.image_url ? (
							<img src={p.image_url} alt={p.plant_name} />
						) : (
							<p>No image</p>
						)}
						<p>{p.type}</p>
						<p>{p.plant_name}</p>
						<p>{p.description}</p>
						<p>
							{p.latitude}, {p.longitude}
						</p>
						<Link to={`/posts/${id}/edit`}>
							<button>Edit</button>
						</Link>
						<button onClick={handleDelete}>Delete</button>
					</>
				);
			}
			default:
				return <p>{"Something went wrong :("}</p>;
		}
	};

	return <div>{showPost()}</div>;
}

export default ViewUserPost;
