import PreviewMap from "../../PreviewMap/PreviewMap";
import { rootSelector } from "../../../../constants/index";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { never } from "../../../../util/never";
import { postNewPost } from "../../../../redux/sagas/posts";
import SelectLocationModal from "../../SelectLocationModal/SelectLocationModal";
import styles from "./CreatePost.module.css";
import { NewPost } from "../../../../../../types/posts";

Modal.setAppElement(rootSelector);

function CreatePost() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const createStatus = useAppSelector((store) => store.errors.createPost);

	const [location, setLocation] = useState({
		latitude: 46.805,
		longitude: -92.081,
	});
	const [locationModalOpen, setLocationModalOpen] = useState(false);

	const [type, setType] = useState<"offer" | "request" | undefined>();
	const [plantName, setPlantName] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [description, setDescription] = useState("");
	const [contactUrl, setContactUrl] = useState("");

	const [awaitingCreateStatus, setAwaitingCreateStatus] = useState(false);

	useEffect(() => {
		if (awaitingCreateStatus) {
			switch (createStatus?.tag) {
				case "success":
					navigate("/posts");
					break;
				case "pending":
					// Keep waiting
					break;
				case "error":
					alert(`Error creating post: ${createStatus.error}`);
					break;
				case undefined:
					// Should be unreachable...
					break;
				// default:
				// never(createStatus);
			}
		}
	}, [createStatus]);

	const validatedInput = useMemo<NewPost | null>(() => {
		const trimmed = {
			plantName: plantName.trim(),
			imageUrl: imageUrl.trim(),
			description: description.trim(),
			conatct: contactUrl.trim(),
		};

		type Input = {
			postType?: "offer" | "request";
			imageUrl?: string;
			plantName?: string;
			description?: string;
			location?: { latitude: number; longitude: number };
			contact?: string;
		};

		const input: Input = {
			...(type && { postType: type }),
			...(trimmed.imageUrl.length > 0 && { imageUrl: trimmed.imageUrl }),
			...(trimmed.plantName.length > 0 && { plantName: trimmed.plantName }),
			...(trimmed.description.length > 0 && {
				description: trimmed.description,
			}),
			...(location && { location: location }),
			...(trimmed.conatct.length > 0 && { contact: trimmed.conatct }),
		};

		if (
			!(input.postType && input.plantName && input.location && input.contact)
		) {
			return null;
		}

		return {
			type: input.postType,
			location: input.location,
			plantName: input.plantName,
			imageUrl: input.imageUrl || null,
			description: input.description || null,
			contact: input.contact,
		};
	}, [type, plantName, imageUrl, description, contactUrl]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (validatedInput === null) {
			console.error("Invalid inputs");
			return;
		}

		dispatch(postNewPost(validatedInput));
		setAwaitingCreateStatus(true);
	};

	return (
		<div>
			<form
				className={styles["container"]}
				action="post"
				onSubmit={handleSubmit}
			>
				<fieldset name="type">
					<legend>Post type</legend>
					<label>
						Offer
						<input
							type="radio"
							onChange={(event) => {
								if (event.target.checked) {
									setType("offer");
								}
							}}
							checked={type === "offer"}
						/>
					</label>
					<label>
						Request
						<input
							type="radio"
							onChange={(event) => {
								if (event.target.checked) {
									setType("request");
								}
							}}
							checked={type === "request"}
						/>
					</label>
				</fieldset>
				<input
					type="text"
					name="plantName"
					placeholder="Plant name"
					value={plantName}
					onChange={(event) => setPlantName(event.target.value)}
				/>
				<input
					type="text"
					name="imageUrl"
					placeholder="Image URL"
					value={imageUrl}
					onChange={(event) => setImageUrl(event.target.value)}
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={description}
					onChange={(event) => setDescription(event.target.value)}
				/>
				<button
					type="button"
					className={`${styles["map-preview-button"]} ${styles["map-preview-container"]}`}
					onClick={() => setLocationModalOpen(true)}
				>
					<PreviewMap
						center={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
						zoom={10}
					/>
				</button>
				<input
					type="text"
					name="contactUrl"
					placeholder="Contact"
					value={contactUrl}
					onChange={(event) => setContactUrl(event.target.value)}
				/>
				<button type="submit">Post</button>
			</form>
			<SelectLocationModal
				isOpen={locationModalOpen}
				onClose={(location) => {
					setLocationModalOpen(false);
					if (location) {
						setLocation({ latitude: location[0], longitude: location[1] });
					}
				}}
				startLocation={[location.latitude, location.longitude]}
			/>
		</div>
	);
}

export default CreatePost;
