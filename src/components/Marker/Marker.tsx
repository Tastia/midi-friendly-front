import classNames from 'classnames/bind';
import Fork from '../../svg/pins/fork.svg';
import styles from './Marker.module.scss';

const c = classNames.bind(styles);

export type MarkerInfos = {
	coords: {
		lat: number;
		lng: number;
	};
	name: string;
};

type MarkerProps = {
	infos: MarkerInfos;
	onClick: () => void;
	lat: number;
	lng: number;
	className?: string;
};

export default function Marker({
	onClick,
	lat,
	lng,
	infos,
	className,
}: MarkerProps) {
	return (
		<div onClick={onClick} className={c('wrapper', className)}>
			<Fork className={c('svg')} />
			<div className={c('infos')}>
				<p className={c('name')}>{infos.name}</p>
			</div>
		</div>
	);
}
