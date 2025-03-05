import React from "react";
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilCloudDownload,
  cilFolder,
  cilLayers,
  cilSpeedometer,
} from "@coreui/icons";
import Header from "../../components/header/Header";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import styles from "./Dashboard.module.scss"
import jsonData from "../../data/data.json";

const Dashboard = () => {
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [boards, setBoards] = React.useState([]);

  // Cargar los tableros al montar el componente
  React.useEffect(() => {
    setBoards(jsonData.boards);
    setSelectedBoard(jsonData.boards[0]); // Seleccionar el primer tablero por defecto
  }, []);
  return (
    <section className={styles.dashboard_section}>
      <Header />
      <div className={styles.dashboard_main_layout}>
        <SidebarExample boards={boards} setSelectedBoard={setSelectedBoard} />
        <main className={styles.dashboard_main_content}>
          {selectedBoard ? (
            <KanbanBoard board={selectedBoard} />
          ) : (
            <p>Selecciona un tablero</p>
          )}
        </main>
      </div>
    </section>
  );
};

const SidebarExample = ({ boards, setSelectedBoard }) => {
  return (
    <CSidebar className="border-end">
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>CoreUI</CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavTitle>ToDoList</CNavTitle>
        <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilFolder} /> Tableros</>}>
          {boards.map((board, index) => (
            <CNavItem key={index} href="#" onClick={() => setSelectedBoard(board)}>
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>{" "}
              {board.title}
            </CNavItem>
          ))}
        </CNavGroup>
        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Nav item
        </CNavItem>
      </CSidebarNav>
      <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>
  );
};
export default Dashboard;
