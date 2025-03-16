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
import TableModal from "../../modals/TableModal";

const Sidebar = ({ boards, setSelectedBoard, refreshBoards }) => {
  // Const for the new table modal
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <TableModal visible={visible} setVisible={setVisible} mode="add" refreshBoards={refreshBoards} />
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

export default Sidebar;