import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import TrackCenter from "./TrackCenter";

import styles from "./PreviewMap.module.css";
import leafletStyles from "../../../styles/leaflet-defaults.module.css";

type Props = {
	center: {
		latitude: number;
		longitude: number;
	};
	zoom: number;
};

function PreviewMap({ center, zoom }: Props): React.JSX.Element {
	return (
		<MapContainer
			zoomControl={false}
			className={[
				styles["map"],
				leafletStyles["marker"],
				leafletStyles["attribution"],
			].join(" ")}
			center={[center.latitude, center.longitude]}
			zoom={zoom}
			doubleClickZoom={false}
			scrollWheelZoom={false}
			dragging={false}
			keyboard={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
			/>
			<TrackCenter center={[center.latitude, center.longitude]} />
			<Marker position={[center.latitude, center.longitude]} />
		</MapContainer>
	);
}

export default PreviewMap;
