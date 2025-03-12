import styles from "./pages_css/Login.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { register } from "../data/auth";
import { CSpinner } from "@coreui/react";
const Register = () => {
  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    navigate("/login");
  }

  const { t } = useTranslation(); // Hook for translations

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirmpassword = () => {
    if (password !== confirmPassword) {
      return false;
    } else {
      return true;
    }
  }

  const handlePasswordLenght = () => {
    if(password.length < 5){
      return false;
    }else{
      return true;
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!handleConfirmpassword()) {
      setError(t("login:passDonotmatch"));
      return;
    }

    if(!handlePasswordLenght()){
      setError(t("login:passMinLength"));
      return;
    }

    setLoading(true);
    setError(null);
    const response = await register(email, password);
    if (response.error) {
      setError(response.error);
    } else {
      navigate("/login");
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
            <h2>{t("login:register")}</h2>
            <form onSubmit={handleRegister}>
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
              <div className={styles.input_group}>
                <label htmlFor="confirmPassword">
                  {t("login:confirmPassword")}
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                />
              </div>
              <button type="submit">{t("login:submit")}</button>
              <div className="d-flex justify-content-center">
                <a href="" onClick={handleClick}>
                  {t("login:title")}
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
