import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Details from '../../components/Details/Details';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import { MarkerInfos } from '../../components/Marker/Marker';
import styles from './organization.module.scss';

const c = classNames.bind(styles);

const LAT_LIMIT = 0.01;
const LONG_LIMIT = 0.02;

type OrgaInfos = {
	coords: {
		lat: number;
		lng: number;
	};
	markers: MarkerInfos[];
};

type PageProps = {
	orga: OrgaInfos;
	markers: MarkerInfos[];
};

export default function Home({ orga }: PageProps) {
	const { data: session } = useSession();

	const [name, setName] = useState('');
	const [id, setId] = useState('');

	return (
		<div className={c('wrapper')}>
			<Header />
			{orga && (
				<Map
					coords={orga.coords}
					markers={orga.markers}
					setName={setName}
					setId={setId}
				/>
			)}

			<Details name={name} id={id} />
		</div>
	);
}

export async function getStaticPaths() {
	const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/organizations', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});

	const orgas = await res.json();

	return {
		paths: orgas.map((orga: any) => ({
			params: { organization: orga.id.toString() },
		})),
		fallback: true, // false or 'blocking'
	};
}

async function requestPlacesApi(params: any) {
	params = new URLSearchParams(params);

	const res = await fetch(
		'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + params,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		},
	);

	const response = await res.json();

	return response;
}

export async function getStaticProps(context: any) {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			'/organizations/' +
			context.params.organization,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		},
	);

	const response = await res.json();

	const coords = {
		lat: response.Place.latitude,
		lng: response.Place.longitude,
	};

	let placesArr = [];

	let places = await requestPlacesApi({
		location: coords.lat + ',' + coords.lng,
		radius: '500',
		key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
		type: 'restaurant',
	});

	placesArr = places.results;

	if (process && process.env.NODE_ENV !== 'development') {
		while (places.next_page_token) {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			places = await requestPlacesApi({
				pagetoken: places.next_page_token,
				key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
			});

			placesArr = placesArr.concat(places.results);
		}
	}

	const orga: OrgaInfos = {
		coords: coords,
		markers: placesArr.map((place: any) => ({
			name: place.name,
			id: place.place_id,
			coords: {
				lat: place.geometry.location.lat,
				lng: place.geometry.location.lng,
			},
		})),
	};

	return {
		props: { orga: orga }, // will be passed to the page component as props
	};
}
