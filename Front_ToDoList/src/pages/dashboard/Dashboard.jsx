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
import TableModal from "../../components/modals/TableModal";

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
        <SidebarExample boards={boards} setSelectedBoard={setSelectedBoard} refreshBoards={refreshBoards}/>
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

const SidebarExample = ({ boards, setSelectedBoard, refreshBoards }) => {
  //Const for the new table modal
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <TableModal visible={visible} setVisible={setVisible} mode="add" refreshBoards={refreshBoards}/>
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
            <CIcon customClassName="nav-icon" icon={cilPlus} /> Añadir tablero
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
