import classNames from 'classnames/bind';
import styles from './Marker.module.scss';

const c = classNames.bind(styles);

export type MarkerInfos = {
	coords?: {
		lat: number;
		lng: number;
	};
	name: string;
	lunchGroupCount: number;
};

type MarkerProps = {
	infos: MarkerInfos;
	onClick?: () => void;
	lat: number;
	lng: number;
	className?: string;
	children: JSX.Element;
	big?: boolean;
};

export default function Marker({
	onClick,
	lat,
	lng,
	infos,
	className,
	children,
	big,
}: MarkerProps) {
	return (
		<div onClick={onClick} className={c('wrapper', className, { big })}>
			<div className={c('infos')}>
				<p className={c('name')}>{infos.name}</p>
			</div>
			<div className={c('svg-container')}>{children}</div>
			{infos.lunchGroupCount > 0 && (
				<div className={c('count')}>
					<span>{infos.lunchGroupCount}</span>
				</div>
			)}
		</div>
	);
}
