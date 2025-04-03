import {
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import { addMember } from "../../../data/member";

const MemberModal = ({ visible, setVisible, board }) => {
  const [addingMember, setAddingMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setMemberEmail(e.target.value);
    setError(null);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (memberEmail.trim() === "") {
      setError("El correo electrónico no puede estar vacío");
      return;
    }
    const result = await addMember(board.id, { email: memberEmail });
    if (result.data.error) {
      setError(result.data.error);
      return;
    } else {
      alert("Miembro añadido correctamente");
      setAddingMember(false);
      setMemberEmail("");
    }
  };

  // Maneja la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddMember(e);
    }
  };

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
                      <CFormInput
                        value={memberEmail}
                        onChange={handleEmailChange}
                        onBlur={() => setAddingMember(false)}
                        onKeyDown={handleKeyDown} // Aquí se captura el evento de la tecla Enter
                      />
                      {error && (
                        <div style={{ color: "red", fontSize: "12px" }}>
                          {error}
                        </div>
                      )}{" "}
                      {/* Mensaje de error */}
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
