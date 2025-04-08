import {
  CFormInput,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPopover,
} from "@coreui/react";
import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cibSuperuser, cilPlus, cilTrash } from "@coreui/icons";
import { addMember, deleteMember, updateMember } from "../../../data/member";

const MemberModal = ({ visible, setVisible, board, refreshBoards }) => {
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
    if (result.error) {
      setError(result.error);
      return;
    } else {
      setAddingMember(false);
      refreshBoards();
      setMemberEmail("");
    }
  };

  // Maneja la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddMember(e);
    }
  };

  const handleRoleChange = async (tableId, userId) => {
    const result = await updateMember(tableId, userId);

    if (result.error) {
      alert(result.error);
    } else {
      refreshBoards();
    }
  };

  const handleDeleteMember = async (memberId) => {
    const result = await deleteMember(memberId);

    if (result.error) {
      alert(result.error);
    } else {
      refreshBoards();
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
            <section className="w-50">
              <p>
                <strong>Propietario:</strong> {board.owner}
              </p>

              <h5>Miembros:</h5>
              <div className="d-flex flex-row align-items-center my-2">
                <CIcon icon={cibSuperuser} />
                <span>&#8594;</span> Admin
              </div>
              <div className="d-flex flex-column">
                {board.members && board.members.length > 0 ? (
                  board.members.map((member, index) => (
                    <div
                      key={index}
                      className="d-flex flex-row align-items-center justify-content-between"
                    >
                      <CPopover
                        content={
                          <div
                            className="d-flex flex-row align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteMember(member.member_id)}
                          >
                            <span>Expulsar</span>
                            <CIcon
                              icon={cilTrash}
                              style={{ color: "red" }}
                              className="ms-2"
                            />
                          </div>
                        }
                        placement="top"
                      >
                        <div style={{ cursor: "pointer" }}>
                          <span>{member.email}</span>
                        </div>
                      </CPopover>
                      <div>
                        <div className="d-flex flex-row align-items-center">
                          <CFormSwitch
                            checked={member.role === "admin"}
                            onChange={() =>
                              handleRoleChange(board.id, member.id)
                            }
                          />
                          <CIcon icon={cibSuperuser} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No hay miembros</span>
                )}
              </div>
            </section>
            <section className="d-flex flex-column align-items-end w-50">
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
