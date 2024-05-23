type ReturnVal = { isValid: true, error: null } | { isValid: false, error: string };

const validateUsername = (username: string): ReturnVal => {
	const trimmedUsername = username.trim();

	if (trimmedUsername.length < 2) {
		return { isValid: false, error: 'Username must be at least 2 characters' };
	}
	if (trimmedUsername.length > 20) {
		return { isValid: false, error: 'Username can\'t be longer than 20 characters' };
	}

	return { isValid: true, error: null };
};

export default validateUsername;

// const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// 	e.preventDefault();

// 	const formData = new FormData(e.currentTarget);
// 	const username = (formData.get('username') as string).trim();

// 	switch (true) {
// 		case username.length < 2:
// 			setInputError('Username must be at least 2 characters');
// 			break;
// 		case username.length > 20:
// 			setInputError('Username can\'t be longer than 20 characters');
// 			break;
// 		default:
// 			setInputError(null);
// 			socket.emit('ROOM_JOIN', roomCode, username);
// 			localStorage.setItem('username', username);
// 			setIsLoading(true);
// 	}
// };
