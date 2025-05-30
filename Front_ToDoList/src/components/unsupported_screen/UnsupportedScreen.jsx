import React from "react";

const UnsupportedScreen = () => {
  return (
    <div style={{
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      borderRadius: "8px",
    }}>
      <h2>Pantalla no compatible</h2>
      <p>El tablero Kanban no está disponible en dispositivos con pantallas pequeñas.</p>
    </div>
  );
};

export default UnsupportedScreen;