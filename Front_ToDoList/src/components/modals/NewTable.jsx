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
import React from "react";

import { addTable } from "../../data/table";
import CIcon from "@coreui/icons-react";
import { cilCommentBubble, cilShortText } from "@coreui/icons";

const NewTable = ({ visible, setVisible }) => {
  const [error, setError] = React.useState(null);

  const [tableData, setTableData] = React.useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    // console.log(tableData);
    if (tableData.name.trim() === "") {
      setError("El nombre del tablero es requerido");
      return;
    }
    // const result = await addTable(tableData);
    // if (result.error) {
    //   alert(result.error);
    //   return;
    // }
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Añadir tablero</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilCommentBubble} />
            </CInputGroupText>
            <CFormInput
              name="name"
              value={tableData.name}
              onChange={handleChange}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilShortText} />
            </CInputGroupText>
            <CFormTextarea
              name="description"
              value={tableData.description}
              onChange={handleChange}
              aria-label="Descripción del tablero"
            />
          </CInputGroup>
          {error && (
            <div className="text-center text-danger fw-bold mt-2 p-2 border border-danger rounded">
              {error}
            </div>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleAddTable}>
          Save changes
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default NewTable;
