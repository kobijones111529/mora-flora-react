import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
	center: [number, number];
	zoom?: number;
};

function TrackCenter({ center, zoom }: Props): null {
	const map = useMap();

	useEffect(() => {
		map.setView(center, zoom);
	}, [center, zoom]);

	return null;
}

export default TrackCenter;
