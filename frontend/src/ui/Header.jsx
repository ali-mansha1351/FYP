import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/login/loginSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "../features/login/useLogout";
import styles from "./Header.module.css";
function Header() {
  const { logout } = useLogout();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const queryClient = useQueryClient();

  function handleLogout() {
    logout(null, {
      onSuccess: (response) => {
        console.log(response);
        dispatch(logoutUser());
        queryClient.removeQueries({ queryKey: ["token"] });
        queryClient.removeQueries({ queryKey: ["user"] });
      },
    });
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Crochet Pattern Pro</Link> {/* Link to home page */}
      </div>
      <nav className={styles.navbar}>
        <ul className={styles["nav-list"]}>
          <li>
            {user.isLoggedIn ? (
              <Link to="/">
                <button onClick={handleLogout}>Logout</button>
              </Link>
            ) : (
              <Link to="/login">
                <button>Login</button>
              </Link>
            )}
            {/* <Link to="/login">
              <button>Login</button>
            </Link> */}
          </li>
          <li>
            {user.isLoggedIn ? (
              <Link to="/user/me">
                <button>{user.userDetail.name || "meee"}</button>
              </Link>
            ) : (
              <Link to="/register">
                <button>Register</button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
