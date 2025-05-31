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
import TableModal from "../../modals/TableModal/TableModal";
import styles from "./Sidebar.module.scss";
import { useTranslation } from "react-i18next"; 

const Sidebar = ({ boards, setSelectedBoard, refreshBoards }) => {
  const { t } = useTranslation(); // Hook for translations

  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <TableModal
        visible={visible}
        setVisible={setVisible}
        mode="add"
        refreshBoards={refreshBoards}
      />
      <CSidebar className={`${styles.sidebar} border-end`}>
        <CSidebarNav>
          <CNavTitle><span style={{color:'lightgray'}}>ToDoList</span></CNavTitle>
          {/* Tableros de los cuales el usuario es dueño */}
          {boards.owned && boards.owned.length > 0 && (
            <CNavGroup
              toggler={
                <div className="d-flex flex-row align-items-center">
                  <CIcon
                    customClassName="nav-icon"
                    icon={cilFolder}
                    style={{ color: "lightgray" }}
                  />
                  <span style={{ color: "lightgray" }}>{t("sidebar:myBoards")}</span>
                </div>
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
                  <span style={{ color: "lightgray" }}>{board.name}</span>
                </CNavItem>
              ))}
            </CNavGroup>
          )}

          {/* Tableros de los cuales el usuario es miembro */}
          {boards.member && boards.member.length > 0 && (
            <CNavGroup
              toggler={
                <>
                  <CIcon
                    customClassName="nav-icon"
                    icon={cilGroup}
                    style={{ color: "lightgray" }}
                  />
                  <span style={{ color: "lightgray" }}>{t("sidebar:teamBoards")}</span>
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
                  <span style={{ color: "lightgray" }}>{board.name}</span>
                </CNavItem>
              ))}
            </CNavGroup>
          )}

          {/* Botón para agregar un nuevo tablero */}
          <CNavItem href="#" onClick={() => setVisible(true)}>
            <CIcon
              customClassName="nav-icon"
              icon={cilPlus}
              style={{ color: "lightgray" }}
            />
            <span style={{ color: "lightgray" }}>{t("sidebar:addBoard")}</span>
          </CNavItem>
        </CSidebarNav>
      </CSidebar>
    </>
  );
};

export default Sidebar;
