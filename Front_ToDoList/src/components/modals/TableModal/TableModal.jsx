import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useState } from "react";

import { addTable, updateTable, deleteTable } from "../../../data/table";
import CIcon from "@coreui/icons-react";
import { cilCommentBubble, cilShortText, cilTrash } from "@coreui/icons";
import styles from "./TableModal.module.scss";

const TableModal = ({ visible, setVisible, board, mode, refreshBoards }) => {
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
      alert("Tablero añadido correctamente");
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
      alert("Tablero actualizado correctamente");
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
      alert("Tablero eliminado correctamente");
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
            {mode === "add" ? "Añadir tablero" : "Editar tablero"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className={styles.modal_body}>
          <CForm>
            <span className={styles.modal_text}>Title</span>
            <CInputGroup className="mb-3">
              <CFormInput
                name="name"
                value={tableData.name}
                onChange={handleChange}
                className={styles.table_input}
              />
            </CInputGroup>
            <span className={styles.modal_text}>Description</span>
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
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={mode === "add" ? handleAddTable : handleUpdateTable}
          >
            Save changes
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
  return (
    <CModal alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Confirmar eliminación</CModalTitle>
      </CModalHeader>
      <CModalBody>
        ¿Estás seguro de que deseas eliminar este tablero? Esta acción no se
        puede deshacer.
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Eliminar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
