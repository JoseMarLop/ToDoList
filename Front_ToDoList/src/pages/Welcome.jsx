import Header from "../components/header/Header";
import dev from "../assets/dev.svg";
import styles from "./pages_css/Welcome.module.scss";
import FeatureCard from "../components/welcome_components/card/FeatureCard";
import { useTranslation } from "react-i18next";
import Footer from "../components/footer/Footer";
import HoverGallery from "../components/welcome_components/hover_gallery/HoverGallery";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const Welcome = () => {
  const { t } = useTranslation(); // Hook for translations

  return (
    <>
      <Header />
      <section className={styles.welcome_section}>
        <div>
          <article>
            <h1>{t("welcome:welcomeTitle")}</h1>
            <h2>{t("welcome:welcomeSubtitle")}</h2>
          </article>

          <figure>
            <img src={dev} alt="foto cabecera" />
          </figure>
        </div>
      </section>
      <motion.section
        className={styles.features_section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }} // Aparece al hacer scroll
      >
        <motion.article variants={fadeInUp}>
          <p>ToDoList</p>
          <h2>{t("welcome:featureCardsTitle")}</h2>
        </motion.article>
        <div className={styles.feature_cards_box}>
          {[
            {
              title: t("welcome:proyectManagement"),
              text: t("welcome:proyectManagementDescription"),
            },
            {
              title: t("welcome:meetings"),
              text: t("welcome:meetingsDescription"),
            },
            {
              title: t("welcome:taskManagement"),
              text: t("welcome:taskManagementDescription"),
            },
            {
              title: t("welcome:integration"),
              text: t("welcome:integrationDescription"),
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <FeatureCard
                title={feature.title}
                text={feature.text}
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>
      <HoverGallery />
      <Footer />
    </>
  );
};

export default Welcome;
