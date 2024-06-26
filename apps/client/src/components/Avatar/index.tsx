import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { memo } from 'react';

interface AvatarProps {
	name: string;
	rounded?: boolean;
	sizeRem?: number;
	className?: string;
	withBorder?: boolean;
}

const Avatar = ({ name, rounded = true, sizeRem = 3, className, withBorder }: AvatarProps) => {
	const avatarDataUri = createAvatar(botttsNeutral, {
		seed: name,
		// eslint-disable-next-line max-len
		backgroundColor: ['FF8844', '44FF88', '7744FF', '66FFFF', 'FF5577', '77FF55', '5577FF', 'FF55FF', 'DDFF55', '55DDFF', 'FF7755', '55FF77', '7755FF', 'FFDD55', '55FFDD', 'DD55FF', 'FF55DD', 'AAFF55', '55FFAA', 'AA55FF', 'FFAA55', '55BB88', '8855BB', 'BB5588', '88BB55', '5588BB', 'BB8855', '55BB99'],
		radius: rounded ? 50 : 0,
		backgroundType: ['solid', 'gradientLinear'],
		size: sizeRem * 16,
	}).toDataUriSync();

	return (
		<img
			className={className}
			src={avatarDataUri}
			alt=""
			style={{
				border: withBorder ? '2px solid currentColor' : 'none',
				borderRadius: rounded ? '50%' : '0',
			}}
		/>
	);
};

export default memo(Avatar);
