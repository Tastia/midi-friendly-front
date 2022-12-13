import { createContext } from 'react';
import { useMapsGateway } from '../../utils/useMapGateway';
import MapPage from './mapPage';

type OrgaInfos = {
	coords: {
		lat: number;
		lng: number;
	};
	restaurants: any[];
	id: string;
};

type PageProps = {
	orga: OrgaInfos;
	restaurants: any;
};

export const MapGatewayContext = createContext({});

export default function MapWrapper({ orga, restaurants }: PageProps) {
	const gatewayAPI = useMapsGateway({
		organizationID: orga.id,
	});

	return (
		<MapGatewayContext.Provider value={gatewayAPI}>
			<MapPage orga={orga} restaurants={restaurants} />
		</MapGatewayContext.Provider>
	);
}

export async function getStaticPaths() {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL + '/api/organization',
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		},
	);

	const orgas = await res.json();

	return {
		paths: orgas.map((orga: any) => ({
			params: { organization: orga._id.toString() },
		})),
		fallback: true, // false or 'blocking'
	};
}

export async function getStaticProps(context: any) {
	const organizationInfoCall = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			'/api/organization/' +
			context.params.organization,
		{
			method: 'GET',
		},
	);
	const organizationInfo = await organizationInfoCall.json();
	const coords = {
		lat: organizationInfo.coordinates.latitude,
		lng: organizationInfo.coordinates.longitude,
	};

	const orga: OrgaInfos = {
		coords: coords,
		restaurants: organizationInfo.restaurants,
		id: context.params.organization,
	};

	return {
		props: { orga: orga, restaurants: orga.restaurants }, // will be passed to the page component as props
	};
}
