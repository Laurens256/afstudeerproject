const endUsername = (name: string) => {
	if (name === 'you') return 'your';
	return (name.endsWith('s') ? `${name}'` : `${name}'s`);
};

const pluralizeUsername = (count: number) => (count === 1 ? '' : 's');

export default {
	endUsername,
	pluralizeUsername,
};
