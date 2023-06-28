import React, { FormEvent, useState } from "react";
import { login } from "../../redux/sagas/login";
import { invalidInput } from "../../redux/reducers/errors/login";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const errors = useAppSelector((store) => store.errors);
	const dispatch = useAppDispatch();

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (username && password) {
			dispatch(
				login({
					username,
					password,
				})
			);
		} else {
			dispatch(invalidInput());
		}
	};

	return (
		<form className="formPanel" onSubmit={handleSubmit}>
			<h2>Login</h2>
			{errors.login && (
				<h3 className="alert" role="alert">
					{errors.login}
				</h3>
			)}
			<div>
				<label htmlFor="username">
					Username:
					<input
						type="text"
						name="username"
						required
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<label htmlFor="password">
					Password:
					<input
						type="password"
						name="password"
						required
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<input className="btn" type="submit" name="submit" value="Log In" />
			</div>
		</form>
	);
}

export default LoginForm;
