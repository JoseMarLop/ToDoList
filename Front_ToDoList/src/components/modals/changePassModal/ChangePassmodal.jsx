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

import styles from "./ChangePassmodal.module.scss";
import { useState } from "react";
import { updatePassword } from "../../../data/auth";

const ChangePassModal = ({ visible, setVisible }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !passwordData.oldPassword ||
      !passwordData.password ||
      !passwordData.repeatPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (passwordData.password.length < 5) {
      setError("New password must be at least 5 characters long");
      return;
    }

    if (passwordData.password !== passwordData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await updatePassword(passwordData);
    if (response.data.error) {
      setError(response.data.error);
      return;
    }else{
      alert("Password changed successfully");
      setVisible(false);
      setPasswordData({
        oldPassword: "",
        password: "",
        repeatPassword: "",
      });
      setError(null);
      window.location.reload();
    }
  };
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => {
        setVisible(false);
        setPasswordData({
          oldPassword: "",
          password: "",
          repeatPassword: "",
        });
        setError(null);
      }}
    >
      <CModalHeader className={styles.modal_header}>
        <CModalTitle>Change password</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.modal_body}>
        <CForm>
          {/* Old password */}
          <CInputGroup className="mb-3">
            <CFormInput
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handleInputChange}
              type="password"
              placeholder="Old Password"
              className={styles.task_input}
            />
          </CInputGroup>

          {/* New password */}
          <CInputGroup className="mb-3">
            <CFormInput
              name="password"
              value={passwordData.password}
              onChange={handleInputChange}
              type="password"
              placeholder="New Password"
              className={styles.task_input}
            />
          </CInputGroup>

          {/* Repeat*/}
          <CInputGroup className="mb-3">
            <CFormInput
              name="repeatPassword"
              value={passwordData.repeatPassword}
              onChange={handleInputChange}
              type="password"
              placeholder="Repeat Password"
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

export default ChangePassModal;
