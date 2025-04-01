import React from "react";



import Header from "../../components/header/Header";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import styles from "./Dashboard.module.scss";
import { getTables } from "../../data/table";

import Sidebar from "../../components/kanban/kanban_components/Sidebar";

const Dashboard = () => {
  // Const para los tableros
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [boards, setBoards] = React.useState({ owned: [], member: [] });

  // Función para actualizar los tableros cuando se añade, elimina o edita un tablero
  const refreshBoards = async () => {
    const result = await getTables(); // Obtener los tableros del backend
    setBoards(result.data); // Asignar los tableros a su estado

    // Establecer el tablero seleccionado
    if (selectedBoard) {
      // Intentamos encontrar el tablero actualizado en la respuesta (ya sea en 'owned' o 'member')
      const updatedBoard = 
        result.data.owned.find((b) => b.id === selectedBoard.id) || 
        result.data.member.find((b) => b.id === selectedBoard.id);
      setSelectedBoard(updatedBoard || (result.data.owned.length > 0 ? result.data.owned[0] : null));
    } else if (result.data.owned.length > 0) {
      // Si no hay tablero seleccionado, seleccionamos el primero de los tableros 'owned'
      setSelectedBoard(result.data.owned[0]);
    }
  };

  React.useEffect(() => {
    refreshBoards(); // Cargar los tableros al cargar el componente
  }, []);

  return (
    <section className={styles.dashboard_section}>
      <Header />
      <div className={styles.dashboard_main_layout}>
        <Sidebar 
          boards={boards} 
          setSelectedBoard={setSelectedBoard} 
          refreshBoards={refreshBoards}
        />
        <main className={styles.dashboard_main_content}>
          {selectedBoard ? (
            <KanbanBoard board={selectedBoard} refreshBoards={refreshBoards} />
          ) : (
            <p>Selecciona un tablero</p>
          )}
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
