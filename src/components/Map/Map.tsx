import classNames from 'classnames/bind';
import GoogleMapReact from 'google-map-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Fork from '../../svg/pins/fork.svg';
import Home from '../../svg/pins/home.svg';
import socket from '../../utils/socket';
import Marker, { MarkerInfos } from '../Marker/Marker';
import styles from './Map.module.scss';

const LAT_LIMIT = 0.004;
const LONG_LIMIT = 0.008;

const c = classNames.bind(styles);

type MapProps = {
	coords: {
		lat: number;
		lng: number;
	};
	markers?: MarkerInfos[];
	setRestaurant: Dispatch<SetStateAction<any>>;
	restaurants: any;
};

export default function Map({
	coords,
	markers,
	setRestaurant,
	restaurants,
}: MapProps) {
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
		setRestaurant(marker);
	}

	const [wsState, updateWsState] = useState(false);
	useEffect(() => {
		console.log(socket);
		socket.then((socket) => {
			if (typeof socket === 'undefined') {
				return;
			}
			socket.on('connect', () => {
				updateWsState(true);
			});
			socket.on('disconnect', () => {
				updateWsState(false);
			});
		});
	}, []);

	return (
		<div className={c('wrapper')}>
			<h1 className={c('ws-status')}>{wsState ? 'ONLINE' : 'OFFLINE'}</h1>
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
						restaurants.map((restaurant: any, i: number) => (
							<Marker
								key={i}
								infos={{
									name: restaurant.name,
									lunchGroupCount: restaurant.lunchGroups?.length,
								}}
								lat={restaurant.coordinates.latitude}
								lng={restaurant.coordinates.longitude}
								onClick={() => handleMarkerClick(restaurant)}
							>
								<Fork className={c('svg')} />
							</Marker>
						))}
					{displayMarkers && (
						<Marker
							infos={{ name: 'Mon entreprise' }}
							lat={coords.lat}
							lng={coords.lng}
							big
						>
							<Home className={c('svg')} />
						</Marker>
					)}
				</GoogleMapReact>
			)}
		</div>
	);
}
