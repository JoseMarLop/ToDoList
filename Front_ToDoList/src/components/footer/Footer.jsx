import styles from "./Footer.module.scss";
import Wave from "react-wavify";
import CIcon from "@coreui/icons-react";
import { cibInstagram, cibTwitter, cibFacebook } from "@coreui/icons";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_wave_container}>
        <Wave
          className={styles.footer_wave}
          fill="#434343"
          paused={false}
          options={{
            height: 60,
            amplitude: 20,
            speed: 0.2,
            points: 4,
          }}
        />
        <Wave
          className={styles.footer_wave}
          fill="#3A3A3A"
          paused={false}
          options={{
            height: 90,
            amplitude: 25,
            speed: 0.3,
            points: 5,
          }}
        />
        <Wave
          className={styles.footer_wave}
          fill="#323232"
          paused={false}
          options={{
            height: 120,
            amplitude: 30,
            speed: 0.13,
            points: 6,
          }}
        />
        <div className={styles.footer_content}>
          <section className={styles.footer_table_section}>
            <table>
              <thead>
                <tr>
                  <th>{t("footer:legalSection")}</th>
                  <th>{t("footer:helpSection")}</th>
                  <th>{t("footer:navigationSection")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("footer:legalDescription1")}</td>
                  <td>{t("footer:helpDescription1")}</td>
                  <td>{t("footer:navigationDescription1")}</td>
                </tr>
                <tr>
                  <td>{t("footer:legalDescription2")}</td>
                  <td>{t("footer:helpDescription2")}</td>
                  <td>{t("footer:navigationDescription2")}</td>
                </tr>
                <tr>
                  <td>{t("footer:legalDescription3")}</td>
                  <td>{t("footer:helpDescription3")}</td>
                  <td>{t("footer:navigationDescription3")}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <div className={styles.footer_icons}>
            <CIcon icon={cibInstagram} className={styles.icon} size="xxl" />
            <CIcon icon={cibTwitter} className={styles.icon} size="xxl" />
            <CIcon icon={cibFacebook} className={styles.icon} size="xxl" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
