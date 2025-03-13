import React from "react";
import {
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
import { cilFolder, cilPlus } from "@coreui/icons";
import Header from "../../components/header/Header";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import styles from "./Dashboard.module.scss";
import { getTables } from "../../data/table";
import NewTable from "../../components/modals/NewTable";

const Dashboard = () => {
  //Const for the boards
  const [selectedBoard, setSelectedBoard] = React.useState(null);
  const [boards, setBoards] = React.useState([]);

  React.useEffect(() => {
    const fetchTables = async () => {
      const result = await getTables();
      setBoards(result.data);
      setSelectedBoard(result.data[0]);
    };
    fetchTables();
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
  //Const for the new table modal
  const [visible, setVisible] = React.useState(false);
  
  return (
    <>
      <NewTable visible={visible} setVisible={setVisible} />
      <CSidebar className="border-end">
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>CoreUI</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          <CNavTitle>ToDoList</CNavTitle>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilFolder} /> Tableros
              </>
            }
          >
            {boards.map((board, index) => (
              <CNavItem
                key={index}
                className="d-flex flex-row align-items-center"
                href="#"
                onClick={() => setSelectedBoard(board)}
              >
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>{" "}
                {board.name}
              </CNavItem>
            ))}
          </CNavGroup>
          <CNavItem href="#" onClick={() => setVisible(true)}>
            <CIcon customClassName="nav-icon" icon={cilPlus}/> Añadir tablero
          </CNavItem>
        </CSidebarNav>
        <CSidebarHeader className="border-top">
          <CSidebarToggler />
        </CSidebarHeader>
      </CSidebar>
    </>
  );
};
export default Dashboard;
