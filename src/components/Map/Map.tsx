import classNames from 'classnames/bind';
import GoogleMapReact from 'google-map-react';
import { Dispatch, SetStateAction, useState } from 'react';
import Marker, { MarkerInfos } from '../Marker/Marker';
import styles from './Map.module.scss';

const LAT_LIMIT = 0.005;
const LONG_LIMIT = 0.01;

const c = classNames.bind(styles);

type MapProps = {
	coords: {
		lat: number;
		lng: number;
	};
	markers: MarkerInfos[];
	setName: Dispatch<SetStateAction<string>>;
	setId: Dispatch<SetStateAction<string>>;
};

export default function Map({ coords, markers, setName, setId }: MapProps) {
	const [displayMarkers, setDisplayMarkers] = useState(false);

	const MapProps = {
		center: {
			lat: coords.lat,
			lng: coords.lng,
		},
		zoom: 17,
	};

	const MapOptions = {
		disableDefaultUI: true,
		restriction: {
			latLngBounds: {
				north: coords.lat + LAT_LIMIT,
				south: coords.lat - LAT_LIMIT,
				east: coords.lng + LONG_LIMIT,
				west: coords.lng - LONG_LIMIT,
			},
		},
	};

	function handleMarkerClick(marker: any) {
		setName(marker.name);
		setId(marker.id);
	}

	return (
		<div className={c('wrapper')}>
			{process.env.NEXT_PUBLIC_MAPS_API_KEY && (
				<GoogleMapReact
					{...MapProps}
					bootstrapURLKeys={{
						key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
						libraries: ['places'],
					}}
					defaultCenter={MapProps.center}
					defaultZoom={MapProps.zoom}
					options={MapOptions}
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={() => setDisplayMarkers(true)}
				>
					{displayMarkers &&
						markers.map((marker, i) => (
							<Marker
								key={i}
								onClick={() => {
									handleMarkerClick(marker);
								}}
								infos={marker}
								lat={marker.coords.lat}
								lng={marker.coords.lng}
							/>
						))}
				</GoogleMapReact>
			)}
		</div>
	);
}
