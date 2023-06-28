import React, { FormEvent, useState } from "react";
import { register } from "../../redux/sagas/registration";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

function RegisterForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const errors = useAppSelector((store) => store.errors);
	const dispatch = useAppDispatch();

	const registerUser = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		dispatch(
			register({
				username: username,
				password: password,
			})
		);
	};

	return (
		<form className="formPanel" onSubmit={registerUser}>
			<h2>Register User</h2>
			{errors.registration && (
				<h3 className="alert" role="alert">
					{errors.registration}
				</h3>
			)}
			<div>
				<label htmlFor="username">
					Username:
					<input
						type="text"
						name="username"
						value={username}
						required
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
						value={password}
						required
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<input className="btn" type="submit" name="submit" value="Register" />
			</div>
		</form>
	);
}

export default RegisterForm;
