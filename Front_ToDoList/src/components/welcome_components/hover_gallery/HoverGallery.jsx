import styles from "./HoverGallery.module.scss";
import { useState } from "react";
import image1 from "../../../assets/carousel1.png";
import image2 from "../../../assets/carousel2.png";
import image3 from "../../../assets/carousel3.png";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";


const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const HoverGallery = () => {
  const { t } = useTranslation();

  const items = [
    {
      title: t("welcome:hoverGalleryCardTitle1"),
      description: t("welcome:hoverGalleryCardDescription1"),
      img: image1,
    },
    {
      title: t("welcome:hoverGalleryCardTitle2"),
      description: t("welcome:hoverGalleryCardDescription2"),
      img: image2,
    },
    {
      title: t("welcome:hoverGalleryCardTitle3"),
      description: t("welcome:hoverGalleryCardDescription3"),
      img: image3,
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <motion.section
      className={styles.hover_gallery}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={fadeInUp}
    >
      <motion.div className={styles.gallery_items} variants={fadeInUp}>
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={
              index === selectedIndex
                ? `${styles.gallery_item} ${styles.selected_gallery_item}`
                : styles.gallery_item
            }
            onClick={() => handleClick(index)}
            variants={fadeInUp}
          >
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <ImageCarousel selectedIndex={selectedIndex} images={items.map((item) => item.img)} />
    </motion.section>
  );
};

const ImageCarousel = ({ selectedIndex, images }) => {
  return (
    <motion.div className={styles.carousel_container} variants={fadeInUp}>
      <div
        className={styles.carousel}
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Gallery ${index}`} className={styles.carousel_image} />
        ))}
      </div>
    </motion.div>
  );
};

export default HoverGallery;


