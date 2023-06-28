import { rootSelector } from "../../../constants/index";
import React, { useRef, useState } from "react";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from "react-leaflet";
import ReactModal from "react-modal";
import styles from "./SelectLocationModal.module.css";
import leafletDefaults from "../../../styles/leaflet-defaults.module.css";
import { LatLng, Marker as MarkerT, Popup as PopupT } from "leaflet";

ReactModal.setAppElement(rootSelector);

type SetLocationProps = {
	setLocation: (_location: LatLng) => void;
};

function SetLocationPopup(props: SetLocationProps): React.JSX.Element {
	const [location, setLocation] = useState<LatLng | null>(null);

	const popupRef = useRef<PopupT | null>(null);

	useMapEvents({
		click: (event) => {
			if (popupRef.current?.isOpen()) {
				popupRef.current?.close();
			} else {
				setLocation(event.latlng);
			}
		},
	});

	const handleSetLocation = (location: LatLng) => {
		props.setLocation(location);
		popupRef.current?.close();
	};

	if (location) {
		return (
			<Popup ref={popupRef} position={location} closeButton={false}>
				<button onClick={() => handleSetLocation(location)}>Set here</button>
			</Popup>
		);
	} else {
		return <></>;
	}
}

type Props = {
	isOpen: boolean;
	onClose: (_location: [number, number] | null) => void;
	startLocation: [number, number];
};

function SelectLocationModal({
	isOpen,
	onClose,
	startLocation,
}: Props): React.JSX.Element {
	const [location, setLocation] = useState<[number, number] | null>(null);

	const markerRef = useRef<MarkerT | null>(null);

	return (
		<ReactModal
			className={styles["container"]}
			isOpen={isOpen}
			onRequestClose={() => onClose(null)}
			shouldCloseOnEsc={location === null}
			shouldCloseOnOverlayClick={false}
			style={{
				overlay: {
					backgroundColor: "rgba(0, 0, 0, 0.5)",
				},
			}}
		>
			<div className={styles["content"]}>
				<MapContainer
					closePopupOnClick={false} // Handle this manually
					className={[
						styles["map"],
						leafletDefaults["marker"],
						leafletDefaults["attribution"],
					].join(" ")}
					center={location || startLocation}
					zoom={10}
					zoomControl={false}
					zoomSnap={0.5}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
					/>
					<Marker
						ref={markerRef}
						eventHandlers={{
							dragend: () => {
								if (markerRef.current) {
									const latlng = markerRef.current.getLatLng();
									setLocation([latlng.lat, latlng.lng]);
								}
							},
						}}
						position={location || startLocation}
						draggable={true}
					/>
					<SetLocationPopup
						setLocation={(loc) => {
							setLocation([loc.lat, loc.lng]);
						}}
					/>
				</MapContainer>
				<div className={styles["button-container"]}>
					<button
						className={styles["button"]}
						onClick={() => {
							setLocation(null);
							onClose(location);
						}}
						disabled={location === null}
					>
						Confirm
					</button>
					<button
						className={styles["button"]}
						onClick={() => {
							setLocation(null);
							onClose(null);
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</ReactModal>
	);
}

export default SelectLocationModal;
