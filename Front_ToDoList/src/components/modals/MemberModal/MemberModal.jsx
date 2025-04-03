import {
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { getSingleTable } from "../../../data/table";
import CIcon from "@coreui/icons-react";
import { cilPlant, cilPlus } from "@coreui/icons";

const MemberModal = ({ visible, setVisible, board }) => {
  // const [tableData, setTable] = useState(null);

  // useEffect(() => {
  //   if (board?.id) {
  //     const handleTable = async () => {
  //       const result = await getSingleTable(board.id);
  //       if (result.error) {
  //         alert(result.error);
  //       } else {
  //         setTable(result.data);
  //       }
  //     };
  //     handleTable();
  //   }
  // }, [board?.id, visible]);

  const [addingMember, setAddingMember] = useState(false);
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>
        <CModalTitle>Miembros</CModalTitle>
      </CModalHeader>
      <CModalBody className="d-flex flex-row">
        {!board ? (
          <div>Cargando...</div>
        ) : (
          <>
            <section className="w-25">
              <p>
                <strong>Propietario:</strong> {board.owner}
              </p>

              <h5>Miembros:</h5>
              <ul>
                {board.members && board.members.length > 0 ? (
                  board.members.map((member, index) => (
                    <li key={index}>{member.email}</li>
                  ))
                ) : (
                  <li>No hay miembros</li>
                )}
              </ul>
            </section>
            <section className="d-flex flex-column align-items-end w-75">
              {board.user_rol === "admin" && (
                <>
                  {addingMember ? (
                    <div>
                      <CFormInput onBlur={() => setAddingMember(false)} />
                    </div>
                  ) : (
                    <div
                      className="d-flex flex-row align-items-center justify-content-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setAddingMember(true)}
                    >
                      <CIcon icon={cilPlus} />
                      <span className="ms-1" style={{ color: "gray" }}>
                        Añadir miembro
                      </span>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </CModalBody>
    </CModal>
  );
};

export default MemberModal;
