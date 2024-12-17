import { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Footer from "./Footer";
function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.email === "ah@gmail.com" &&
      formData.password === "1234567890"
    ) {
      navigate("/");
    } else {
      setError("invalid email or password");
    }
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;
