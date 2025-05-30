import React from "react";

import Header from "../../components/header/Header";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import styles from "./Dashboard.module.scss";
import { getTables } from "../../data/table";

import useWindowWidth from "../../hooks/useWindowWidth";
import UnsupportedScreen from "../../components/unsupported_screen/UnsupportedScreen";

import Sidebar from "../../components/kanban/kanban_components/Sidebar";

const Dashboard = () => {
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [boards, setBoards] = React.useState({ owned: [], member: [] });

  const width = useWindowWidth();
  const MIN_WIDTH = 1150;

  const refreshBoards = async () => {
    const result = await getTables();
    setBoards(result.data);

    if (selectedBoard) {
      const updatedBoard =
        result.data.owned.find((b) => b.id === selectedBoard.id) ||
        result.data.member.find((b) => b.id === selectedBoard.id);
      setSelectedBoard(
        updatedBoard ||
          (result.data.owned.length > 0 ? result.data.owned[0] : null)
      );
    } else if (result.data.owned.length > 0) {
      setSelectedBoard(result.data.owned[0]);
    }
  };

  React.useEffect(() => {
    refreshBoards();
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
            width < MIN_WIDTH ? (
              <UnsupportedScreen />
            ) : (
              <KanbanBoard
                board={selectedBoard}
                refreshBoards={refreshBoards}
              />
            )
          ) : (
            <p>Selecciona un tablero</p>
          )}
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
