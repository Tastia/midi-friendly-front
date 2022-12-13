import classNames from 'classnames/bind';
import GoogleMapReact from 'google-map-react';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { MapGatewayContext } from '../../pages/map/[organization]';
import Fork from '../../svg/pins/fork.svg';
import Home from '../../svg/pins/home.svg';
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
	groupList: any[];
};

export default function Map({
	coords,
	markers,
	setRestaurant,
	restaurants,
	groupList,
}: MapProps) {
	const [displayMarkers, setDisplayMarkers] = useState(false);
	const gatewayAPI = useContext<any>(MapGatewayContext);

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

	function getGroupCount(restaurantID: string) {
		if (groupList.length === 0) {
			return;
		}
		return groupList.reduce((n, x) => n + (x.restaurant === restaurantID), 0);
	}

	return (
		<div className={c('wrapper')}>
			<h1 className={c('ws-status', { connected: gatewayAPI.connected })}>
				{gatewayAPI.connected ? 'ONLINE' : 'OFFLINE'}
			</h1>
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
									lunchGroupCount: getGroupCount(restaurant._id),
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
