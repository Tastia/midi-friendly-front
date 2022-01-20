import classNames from 'classnames/bind';
import React from 'react';
import styles from './TemplateName.module.scss';

const c = classNames.bind(styles);

interface TemplateNameProps {
	className?: string;
}

function TemplateName({ className }: TemplateNameProps) {
	return (
		<div className={c('wrapper', className)}>
			<p>TemplateName</p>
		</div>
	);
}

export default TemplateName;
