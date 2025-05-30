import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import styles from "./ChangeEmailmodal.module.scss";
import { useState } from "react";
import { updateEmail } from "../../../data/auth";
import { logout } from "../../../data/auth";

const ChangeEmailModal = ({ visible, setVisible }) => {
  const [emailData, setEmailData] = useState({
    password: "",
    newEmail: "",
    repeatEmail: "",
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      emailData.password.trim() === "" ||
      emailData.newEmail.trim() === "" ||
      emailData.repeatEmail.trim() === ""
    ) {
      setError("All fields are required");
      return;
    }

    if (emailData.newEmail !== emailData.repeatEmail) {
      setError("Emails do not match");
      return;
    }

    const response = await updateEmail(emailData);

    if (response.error) {
      setError(response.error);
      return;
    } else {
      alert("Email updated successfully");
      setVisible(false);
      setEmailData({
        password: "",
        newEmail: "",
        repeatEmail: "",
      });
      setError(null);
      logout();
    }
  };
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => {
        setVisible(false);
        setEmailData({
          password: "",
          newEmail: "",
          repeatEmail: "",
        });
        setError(null);
      }}
    >
      <CModalHeader className={styles.modal_header}>
        <CModalTitle>Change email</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.modal_body}>
        <CForm>
          {/* Password */}
          <CInputGroup className="mb-3">
            <CFormInput
              name="password"
              value={emailData.password}
              onChange={handleInputChange}
              type="password"
              placeholder="Password"
              className={styles.task_input}
            />
          </CInputGroup>

          {/* New email */}
          <CInputGroup className="mb-3">
            <CFormInput
              name="newEmail"
              value={emailData.newEmail}
              onChange={handleInputChange}
              placeholder="New Email"
              type="email"
              className={styles.task_input}
            />
          </CInputGroup>

          {/* Repeat*/}
          <CInputGroup className="mb-3">
            <CFormInput
              name="repeatEmail"
              value={emailData.repeatEmail}
              onChange={handleInputChange}
              placeholder="Repeat Email"
              type="email"
              className={styles.task_input}
            />
          </CInputGroup>
          {/* Mensaje de error */}
          {error && (
            <div
              className="text-danger text-center mb-3"
              style={{ fontSize: "0.9rem" }}
            >
              {error}
            </div>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter className={styles.modal_footer}>
        <CButton color="primary" onClick={handleSave}>
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ChangeEmailModal;
