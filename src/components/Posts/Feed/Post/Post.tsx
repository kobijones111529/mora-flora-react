import { useAppSelector } from "../../../../redux/hooks";
import { never } from "../../../../util/never";
import styles from "./Post.module.css";

/**
 * @typedef Location
 * @property {number} latitude
 * @property {number} longitude
 * @typedef Props
 * @property {'offer' | 'request'} type
 * @property {string} plantName
 * @property {string} [imageUrl]
 * @property {string} [description]
 * @property {Location} location
 * @property {string} contact
 */

const distanceFormatter = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 1,
});

type Props = {
	type: "offer" | "request";
	plantName: string;
	imageUrl?: string;
	description?: string;
	location: {
		latitude: number;
		longitude: number;
	};
	contact: string;
};

function Post({
	type,
	plantName,
	imageUrl,
	description,
	location: { latitude, longitude },
	contact,
}: Props) {
	const filters = useAppSelector((store) => store.filters);

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
			// default:
			// return never(type);
		}
	};

	const showDistance = () => {
		if (filters.location) {
			return (
				<p className={styles["distance"]}>
					{distanceFormatter.format(
						distanceMeters(filters.location.center, [latitude, longitude]) /
							1609.344
					)}{" "}
					mi
				</p>
			);
		} else {
			return <></>;
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
		<div className={styles["card"]}>
			<img className={styles.img} src={imageUrl} alt={plantName} />
			<div className={styles["top-row"]}>
				<div>
					{showPostType()}
					{showDistance()}
				</div>
				<h3>{plantName}</h3>
			</div>
			{showDescription()}
			<div className={styles["contact"]}>
				<h4>Contact</h4>
				<p>{contact}</p>
			</div>
		</div>
	);
}

const distanceMeters = (l1: [number, number], l2: [number, number]): number => {
	const lat1 = l1[0];
	const lon1 = l1[1];
	const lat2 = l2[0];
	const lon2 = l2[1];

	const R = 6371e3; // metres
	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in metres
	return d;
};

export default Post;
