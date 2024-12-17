import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <NavLink to="/">MyBookShelf</NavLink> {/* Link to home page */}
      </div>
      <nav className={styles.navbar}>
        <ul className={styles["nav-list"]}>
          <li>
            <NavLink to="/login">
              <button>Login</button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/register">
              <button>Register</button>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
