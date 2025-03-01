import styles from "./pages_css/Login.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { login } from "../data/auth";
import { CSpinner } from "@coreui/react";

const Login = () => {
  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    navigate("/register");
  }

  const { t } = useTranslation(); // Hook for translations

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await login(email, password);

    if (response.error) {
      setError(response.error);
    } else {
      navigate("/welcome");
    }
    setLoading(false);
  };
  return (
    <div className={styles.login_container}>
      <div className={styles.login_box}>
        {loading ? (
          <div className="d-flex justify-content-center">
            <CSpinner size="lg" />
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger">{error}</div>}
            <h2>{t("login:title")}</h2>
            <form onSubmit={handleLogin}>
              <div className={styles.input_group}>
                <label htmlFor="email">{t("login:email")}</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>
              <div className={styles.input_group}>
                <label htmlFor="password">{t("login:password")}</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>
              <button type="submit">{t("login:submit")}</button>
              <div className="d-flex justify-content-center">
                <a href="#" onClick={handleClick}>
                  {t("login:register")}
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
