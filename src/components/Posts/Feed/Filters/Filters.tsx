import SelectLocationModal from "../../SelectLocationModal/SelectLocationModal";
import React, { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setLocationFilter } from "../../../../redux/reducers/filters";
import PreviewMap from "../../PreviewMap/PreviewMap";

import styles from "./Filters.module.css";

function Filters() {
	const dispatch = useAppDispatch();
	const filters = useAppSelector((store) => store.filters);

	const [locationModalOpen, setLocationModalOpen] = useState(false);

	const [location, setLocation] = useState({
		latitude: filters.location?.center[0] || 46.79,
		longitude: filters.location?.center[1] || -92.1,
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		dispatch(
			setLocationFilter({
				center: [location.latitude, location.longitude],
			})
		);
	};

	return (
		<>
			<form onSubmit={handleSubmit} className={styles["form"]}>
				<button
					type="button"
					onClick={() => setLocationModalOpen(true)}
					className={styles["map-preview-button"]}
				>
					<PreviewMap
						center={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
						zoom={10}
					/>
				</button>
				<button>Filter</button>
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
		</>
	);
}

export default Filters;
