import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import styles from "./Nav.module.css";
import { logout } from "../../redux/sagas/login";

function Nav() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const user = useAppSelector((store) => store.user);

	const showLogin = () => {
		if (user.tag === "Some") {
			return <a onClick={() => dispatch(logout())}>Logout</a>;
		} else {
			return <a onClick={() => navigate("/login")}>Login</a>;
		}
	};

	const showNav = () => {
		return (
			<ol className={styles["nav"]}>
				<li className={styles["nav-item"]}>
					<div>{showLogin()}</div>
				</li>
				<li className={styles["home-button-container"]}>
					<button
						onClick={() => navigate("/")}
						className={styles["home-button"]}
					>
						<i className="fa-solid fa-house" />
					</button>
				</li>
				<li className={styles["nav-item"]}>
					<div>
						<a onClick={() => navigate("/posts")}>Posts</a>
					</div>
				</li>
			</ol>
		);
	};

	return <nav className={styles["container"]}>{showNav()}</nav>;
}

export default Nav;
