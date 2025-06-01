import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useState } from "react";

import { addTable, updateTable, deleteTable } from "../../../data/table";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import styles from "./TableModal.module.scss";
import { useTranslation } from "react-i18next";

const TableModal = ({ visible, setVisible, board, mode, refreshBoards }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const [tableData, setTableData] = useState({
    name: board ? board.name : "",
    description: board ? board.description : "",
  });

  React.useEffect(() => {
    if (board) {
      setTableData({ name: board.name, description: board.description });
    }
  }, [board]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (tableData.name.trim() === "") {
      setError("El nombre del tablero no puede estar en blanco");
      return;
    }
    const result = await addTable(tableData);
    if (result.error) {
      setError(result.error);
      return;
    } else {
      refreshBoards();
      setVisible(false);
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    if (tableData.name.trim() === "") {
      setError("El nombre del tablero no puede estar en blanco");
      return;
    }
    const result = await updateTable(tableData, board.id);
    if (result.error) {
      setError(result.error);
      return;
    } else {
      // alert("Tablero actualizado correctamente");
      refreshBoards();
      setVisible(false);
    }
  };

  const handleDeleteTable = async () => {
    const result = await deleteTable(board.id);
    if (result.error) {
      setError(result.error);
      return;
    } else {
      refreshBoards();
      setDeleteConfirmVisible(false);
      setVisible(false);
    }
  };

  return (
    <>
      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader className={styles.modal_header}>
          <CModalTitle>
            {mode === "add" ? t("modal:addTable") : t("modal:editTable")}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className={styles.modal_body}>
          <CForm>
            <span className={styles.modal_text}>{t("modal:title")}</span>
            <CInputGroup className="mb-3">
              <CFormInput
                name="name"
                value={tableData.name}
                onChange={handleChange}
                className={styles.table_input}
              />
            </CInputGroup>
            <span className={styles.modal_text}>
              {t("modal:description")}
            </span>
            <CInputGroup className="mb-3">
              {/* <CInputGroupText>
                <CIcon icon={cilShortText} />
              </CInputGroupText> */}
              <CFormTextarea
                name="description"
                value={tableData.description}
                onChange={handleChange}
                aria-label="Descripción del tablero"
                className={styles.table_input}
              />
            </CInputGroup>
            {error && (
              <div className="text-center text-danger fw-bold mt-2 p-2 border border-danger rounded">
                {error}
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter className={styles.modal_footer}>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            {t("modal:close")}
          </CButton>
          <CButton
            color="primary"
            onClick={mode === "add" ? handleAddTable : handleUpdateTable}
          >
            {t("modal:save")}
          </CButton>
          {mode !== "add" && (
            <CButton
              color="danger"
              onClick={() => setDeleteConfirmVisible(true)}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
        onConfirm={handleDeleteTable}
      />
    </>
  );
};

export default TableModal;

//Modal to confirm deletion
const DeleteConfirmModal = ({ visible, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <CModal alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{t("modal:confirmation")}</CModalTitle>
      </CModalHeader>
      <CModalBody>{t("modal:deleteTable")}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          {t("modal:cancel")}
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          {t("modal:delete")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
