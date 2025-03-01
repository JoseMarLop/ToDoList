import styles from "./FeatureCard.module.scss";

const FeatureCard = ({ title, text, index }) => {
    // Colores alternados
    const colors = ["#EC7E17", "#0077b6", "#2a9d8f"];
    const color = colors[index % colors.length];
  
    return (
      <div className={styles.feature_card}>
        <div
          className={styles.feature_card_color_bar}
          style={{ backgroundColor: color }} // Se aplica el color dinámico
        />
        <div className={styles.feature_card_textbox}>
          <h4>{title}</h4>
          <p>{text}</p>
        </div>
      </div>
    );
  };
  
  export default FeatureCard;