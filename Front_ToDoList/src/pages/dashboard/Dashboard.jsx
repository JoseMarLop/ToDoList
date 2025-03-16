import React from "react";



import Header from "../../components/header/Header";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import styles from "./Dashboard.module.scss";
import { getTables } from "../../data/table";

import Sidebar from "../../components/kanban/kanban_components/Sidebar";

const Dashboard = () => {
  //Const for the boards
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [boards, setBoards] = React.useState([]);

  //Function to refresh boards when a board is added, deleted or edited
  const refreshBoards = async () => {
    const result = await getTables();
    setBoards(result.data);

    if (selectedBoard) {
      const updatedBoard = result.data.find((b) => b.id === selectedBoard.id);
      setSelectedBoard(
        updatedBoard || (result.data.length > 0 ? result.data[0] : null)
      );
    } else if (result.data.length > 0) {
      setSelectedBoard(result.data[0]);
    }
  };

  React.useEffect(() => {
    refreshBoards();
  }, []);

  return (
    <section className={styles.dashboard_section}>
      <Header />
      <div className={styles.dashboard_main_layout}>
        <Sidebar boards={boards} setSelectedBoard={setSelectedBoard} refreshBoards={refreshBoards}/>
        <main className={styles.dashboard_main_content}>
          {selectedBoard ? (
            <KanbanBoard board={selectedBoard} refreshBoards={refreshBoards}/>
          ) : (
            <p>Selecciona un tablero</p>
          )}
        </main>
      </div>
    </section>
  );
};
export default Dashboard;
