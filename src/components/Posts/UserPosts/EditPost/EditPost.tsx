import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost } from "../../../../redux/sagas/post";
import { editPost } from "../../../../redux/sagas/posts";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { never } from "../../../../util/never";
import PreviewMap from "../../PreviewMap/PreviewMap";

import styles from "./EditPost.module.css";
import SelectLocationModal from "../../SelectLocationModal/SelectLocationModal";
import { Post } from "../../../../../../types/posts";

type EditMode<T> = { tag: "no_edit" } | { tag: "edit"; value: T };

function EditUserPost() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const post = useAppSelector((store) => store.post);
	const user = useAppSelector((store) => store.user);
	const params = useParams();
	const id = Number(params["id"]);

	const [imageUrlEdit, setImageUrlEdit] = useState<
		EditMode<{ input: string; loaded: string | null }>
	>({ tag: "no_edit" });
	const [plantNameEdit, setPlantNameEdit] = useState<EditMode<string>>({
		tag: "no_edit",
	});
	const [descriptionEdit, setDescriptionEdit] = useState<EditMode<string>>({
		tag: "no_edit",
	});
	const [locationEdit, setLocationEdit] = useState<EditMode<[number, number]>>({
		tag: "no_edit",
	});
	const [contactEdit, setContactEdit] = useState<EditMode<string>>({
		tag: "no_edit",
	});

	useEffect(() => {
		const timout = setTimeout(() => {
			setImageUrlEdit((mode) => {
				if (mode.tag === "edit") {
					return {
						...mode,
						value: {
							...mode.value,
							loaded: mode.value.input,
						},
					};
				} else {
					return mode;
				}
			});
		}, 1000);
		return () => clearTimeout(timout);
	}, [imageUrlEdit]);

	const [postTypeInput, setPostTypeInput] = useState<
		"offer" | "request" | undefined
	>();

	const [mapOpen, setMapOpen] = useState(false);

	const loadedImage = useMemo<string | null>(() => {
		if (imageUrlEdit.tag === "edit") {
			return imageUrlEdit.value.loaded;
		} else if (post.tag === "Some") {
			return post.post.image_url;
		} else {
			return null;
		}
	}, [post, imageUrlEdit]);

	useEffect(() => {
		dispatch(fetchPost(id));
	}, [user, id]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trim = (value: string): string | null => {
			const trimmed = value.trim();
			return (trimmed !== "" && trimmed) || null;
		};

		const postType = postTypeInput;
		const plantName =
			plantNameEdit.tag === "edit" ? trim(plantNameEdit.value) : undefined;
		const imageUrl =
			imageUrlEdit.tag === "edit" ? imageUrlEdit.value.loaded : undefined;
		const description =
			descriptionEdit.tag === "edit" ? trim(descriptionEdit.value) : undefined;
		const location =
			(locationEdit.tag === "edit" && locationEdit.value) || undefined;
		const contact =
			contactEdit.tag === "edit" ? trim(contactEdit.value) : undefined;

		if (plantName === null) {
			alert("Plant name required");
			return;
		}

		if (contact === null) {
			alert("Contact information required");
			return;
		}

		dispatch(
			editPost(id, {
				...(postType !== undefined && { type: postType }),
				...(plantName !== undefined && { plantName: plantName }),
				...(imageUrl !== undefined && { imageUrl: imageUrl }),
				...(description !== undefined && { description: description }),
				...(location !== undefined && {
					location: {
						latitude: location[0],
						longitude: location[1],
					},
				}),
				...(contact !== undefined && { contact: contact }),
			})
		);

		// TODO: wait for status update
		navigate("/posts");
	};

	/**
	 * @param {Post} post
	 * @returns {React.JSX.Element}
	 */
	const showEditImageUrl = (post: Post) => {
		if (imageUrlEdit.tag === "edit") {
			return (
				<div>
					<input
						type="text"
						placeholder="Image URL"
						value={imageUrlEdit.value.input}
						onChange={(event) => {
							setImageUrlEdit({
								...imageUrlEdit,
								value: {
									...imageUrlEdit.value,
									input: event.target.value,
								},
							});
						}}
					/>
					<button
						type="button"
						onClick={() => {
							setImageUrlEdit({ tag: "no_edit" });
						}}
					>
						X
					</button>
				</div>
			);
		} else {
			return (
				<div>
					<button
						onClick={() => {
							setImageUrlEdit({
								tag: "edit",
								value: {
									input: post.image_url || "",
									loaded: post.image_url || "",
								},
							});
						}}
					>
						{post.image_url === null ? "Add image" : "Change image"}
					</button>
				</div>
			);
		}
	};

	const showEditPostType = (post: Post) => {
		return (
			<fieldset name="type">
				<legend>Post type</legend>
				<label>
					Offer
					<input
						type="radio"
						onChange={(event) => {
							if (event.target.checked) {
								setPostTypeInput("offer");
							}
						}}
						checked={
							postTypeInput ? postTypeInput === "offer" : post.type === "offer"
						}
					/>
				</label>
				<label>
					Request
					<input
						type="radio"
						onChange={(event) => {
							if (event.target.checked) {
								setPostTypeInput("request");
							}
						}}
						checked={
							postTypeInput
								? postTypeInput === "request"
								: post.type === "request"
						}
					/>
				</label>
			</fieldset>
		);
	};

	const showEditPlantName = (post: Post) => {
		if (plantNameEdit.tag === "edit") {
			return (
				<div>
					<input
						type="text"
						placeholder="Plant name"
						value={plantNameEdit.value}
						onChange={(event) => {
							setPlantNameEdit((mode) => {
								if (mode.tag === "edit") {
									return { ...mode, value: event.target.value };
								} else {
									return mode;
								}
							});
						}}
					/>
					<button
						type="button"
						onClick={() => {
							setPlantNameEdit({ tag: "no_edit" });
						}}
					>
						X
					</button>
				</div>
			);
		} else {
			return (
				<div>
					<p>{post.plant_name}</p>
					<button
						type="button"
						onClick={() => {
							setPlantNameEdit({
								tag: "edit",
								value: post.plant_name,
							});
						}}
					>
						Edit
					</button>
				</div>
			);
		}
	};

	const showEditDescription = (post: Post) => {
		switch (descriptionEdit.tag) {
			case "edit":
				return (
					<div>
						<textarea
							placeholder="Description"
							value={descriptionEdit.value}
							onChange={(event) => {
								setDescriptionEdit((mode) => {
									switch (mode.tag) {
										case "edit":
											return { ...mode, value: event.target.value };
										case "no_edit":
											return mode;
										// default:
										// return never(mode);
									}
								});
							}}
						/>
						<button
							type="button"
							onClick={() => {
								setDescriptionEdit({ tag: "no_edit" });
							}}
						>
							X
						</button>
					</div>
				);
			case "no_edit":
				return (
					<div>
						{post.description === null ? (
							<p>No description</p>
						) : (
							<p>{post.description}</p>
						)}
						<button
							type="button"
							onClick={() => {
								setDescriptionEdit({
									tag: "edit",
									value: post.description || "",
								});
							}}
						>
							Edit
						</button>
					</div>
				);
			// default:
			// return never(descriptionEdit);
		}
	};

	const showEditLocation = (defaultValue: [number, number]) => {
		const location =
			(locationEdit.tag === "edit" && locationEdit.value) || defaultValue;

		return (
			<button
				type="button"
				onClick={() => {
					setMapOpen(true);
				}}
				className={styles["map-button"]}
			>
				<PreviewMap
					center={{ latitude: location[0], longitude: location[1] }}
					zoom={10}
				/>
			</button>
		);
	};

	const showEditContact = (post: Post) => {
		switch (contactEdit.tag) {
			case "edit":
				return (
					<div>
						<input
							type="text"
							placeholder="Contact"
							value={contactEdit.value}
							onChange={(event) => {
								setContactEdit((mode) => {
									switch (mode.tag) {
										case "edit":
											return { ...mode, value: event.target.value };
										case "no_edit":
											return mode;
										default:
										// return never(mode);
									}
								});
							}}
						/>
						<button
							type="button"
							onClick={() => {
								setContactEdit({ tag: "no_edit" });
							}}
						>
							X
						</button>
					</div>
				);
			case "no_edit":
				return (
					<div>
						<p>{post.contact_url}</p>
						<button
							type="button"
							onClick={() => {
								setContactEdit({ tag: "edit", value: post.contact_url });
							}}
						>
							Edit
						</button>
					</div>
				);
			// default:
			// return never(contactEdit);
		}
	};

	const showPost = () => {
		switch (post.tag) {
			case "None":
			case "Loading":
				return <p>Loading...</p>;
			case "Some": {
				const data = post.post;
				return (
					<form onSubmit={handleSubmit} className={styles["form"]}>
						{loadedImage ? <img src={loadedImage} /> : <></>}
						{showEditImageUrl(data)}
						{showEditPostType(data)}
						{showEditPlantName(data)}
						{showEditDescription(data)}
						{showEditLocation([data.latitude, data.longitude])}
						{showEditContact(data)}
						<button type="submit">Save changes</button>
						<button
							type="reset"
							onClick={() => {
								navigate("/posts");
							}}
						>
							Discard changes
						</button>
					</form>
				);
			}
			default:
				return <p>{"Something went wrong :("}</p>;
		}
	};

	return (
		<div>
			{showPost()}
			{post.tag === "Some" && (
				<SelectLocationModal
					isOpen={mapOpen}
					onClose={(location) => {
						setMapOpen(false);
						if (location) {
							setLocationEdit({ tag: "edit", value: location });
						}
					}}
					startLocation={
						(locationEdit.tag === "edit" && locationEdit.value) || [
							post.post.latitude,
							post.post.longitude,
						]
					}
				/>
			)}
		</div>
	);
}

export default EditUserPost;
