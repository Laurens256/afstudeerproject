import { Button } from '@/components';
import { API_URL } from '@/app.constants';

const Home = () => {
	return (
		<div>
			<h1>Home</h1>
			<form action={`${API_URL}/sign-up`} method="POST">
				<label htmlFor="signup_username">Username</label>
				<input type="text" name="signup_username" id="signup_username" />

				<label htmlFor="signup_password">Password</label>
				<input type="password" name="signup_password" id="signup_password" />

				<Button type="submit">Sign up</Button>
			</form>

			<form action={`${API_URL}/login`} method="POST">
				<label htmlFor="login_username">Username</label>
				<input type="text" name="login_username" id="login_username" />

				<label htmlFor="login_password">Password</label>
				<input type="password" name="login_password" id="login_password" />

				<Button type="submit">Log in</Button>
			</form>
		</div>
	);
};

export default Home;
