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
import { useEffect, useState } from "react";
import { addTask } from "../../../data/task";
import styles from "./NewTaskModal.module.scss";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { useTranslation } from "react-i18next";

const NewTaskModal = ({ visible, setVisible, board, refreshBoards }) => {
  const { t } = useTranslation();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "1",
    table_id: board.id,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setTaskData((prevData) => ({
      ...prevData,
      table_id: board.id,
    }));
  }, [board.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "title" && error) {
      setError(null);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (taskData.title.trim() === "") {
      setError(t("modal:nonEmptyError"));
      return;
    }
    const result = await addTask(taskData);
    if (result.error) {
      setError(result.error);
      return;
    } else {
      refreshBoards();
      setVisible(false);
      setError(null);
    }
  };

  const getPriorityIcon = () => {
    switch (taskData.priority) {
      case "1":
        return <FcLowPriority size={24} />;
      case "2":
        return <FcMediumPriority size={24} />;
      case "3":
        return <FcHighPriority size={24} />;
      default:
        return <FcLowPriority size={24} />;
    }
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => {
        setVisible(false);
        setError(null);
        setTaskData({
          title: "",
          description: "",
          priority: "1",
          table_id: board.id,
        });
      }}
    >
      <CModalHeader className={styles.modal_header}>
        <CModalTitle>{t("modal:addTask")}</CModalTitle>
      </CModalHeader>
      <CModalBody className={styles.modal_body}>
        <CForm>
          {/* Title */}
          <CInputGroup className="mb-3">
            <CFormInput
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder={t("modal:title")}
              className={styles.task_input}
            />
          </CInputGroup>
          {error && (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginBottom: "0.75rem",
              }}
            >
              {error}
            </div>
          )}
          {/* Description */}
          <CInputGroup className="mb-3">
            <CFormTextarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              placeholder={t("modal:description")}
              className={styles.task_input}
            />
          </CInputGroup>

          {/* Priority */}
          <div className="mb-3 w-50">
            <div className="d-flex flex-row align-items-center mb-2">
              <span className="me-3">{t("modal:priority")}</span>
              {getPriorityIcon()}
            </div>
            <CInputGroup>
              <select
                className={styles.task_select}
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
              >
                <option value="1">{t("modal:low")}</option>
                <option value="2">{t("modal:medium")}</option>
                <option value="3">{t("modal:high")}</option>
              </select>
            </CInputGroup>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter className={styles.modal_footer}>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          {t("modal:close")}
        </CButton>
        <CButton color="primary" onClick={handleAddTask}>
          {t("modal:save")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default NewTaskModal;
