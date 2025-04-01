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
import { cilFolder, cilGroup, cilPlus } from "@coreui/icons";
import TableModal from "../../modals/TableModal";

const Sidebar = ({ boards, setSelectedBoard, refreshBoards }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <TableModal
        visible={visible}
        setVisible={setVisible}
        mode="add"
        refreshBoards={refreshBoards}
      />
      <CSidebar className="border-end">
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>CoreUI</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          <CNavTitle>ToDoList</CNavTitle>

          {/* Tableros de los cuales el usuario es dueño */}
          {boards.owned && boards.owned.length > 0 && (
            <CNavGroup
              toggler={
                <>
                  <CIcon customClassName="nav-icon" icon={cilFolder} /> Mis tableros
                </>
              }
            >
              {boards.owned.map((board, index) => (
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
          )}

          {/* Tableros de los cuales el usuario es miembro */}
          {boards.member && boards.member.length > 0 && (
            <CNavGroup
              toggler={
                <>
                  <CIcon customClassName="nav-icon" icon={cilGroup} /> Equipos
                </>
              }
            >
              {boards.member.map((board, index) => (
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
          )}

          {/* Botón para agregar un nuevo tablero */}
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