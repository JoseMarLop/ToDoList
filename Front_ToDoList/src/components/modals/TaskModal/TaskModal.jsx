import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import { useEffect, useState } from "react";
import {
  getTask,
  updateTask,
  deleteTask,
  changeAssignee,
} from "../../../data/task";
import CIcon from "@coreui/icons-react";
import {
  cilDescription,
  cilPencil,
  cilSpeech,
  cilTrash,
  cilUser,
} from "@coreui/icons";
import styles from "./TaskModal.module.scss";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";

import { useTranslation } from "react-i18next";

import Subtasks from "./Subtasks";
import Comments from "./Comments";

const TaskModal = ({ visible, setVisible, task, refreshBoards }) => {
  const { t } = useTranslation();
  // State variables for task details
  const [fullTask, setFullTask] = useState(null);
  const [originalTask, setOriginalTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState(null);

  // Effect hook to fetch task data when task ID is available
  useEffect(() => {
    if (task?.id) {
      const handleTask = async () => {
        const result = await getTask(task.id);
        if (result.error) {
          setError(result.error);
        } else {
          setFullTask(result);
          setOriginalTask(result);
          setTitle(result.title);
          setDescription(result.description);
        }
      };
      handleTask();
    }
  }, [task?.id]);

  /*
    ################################################################
    ########################## TASKS ###############################
    ################################################################
  */

  // State and handlers for editing the title of the task
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  // State and handlers for title blur (when user finishes editing)
  const handleTitleBlur = () => {
    if (title.trim() === "") {
      setTitle(originalTask?.title || "");
      setError("El título no puede estar vacío.");
    } else {
      setIsEditingTitle(false);
      setFullTask((prevTask) => ({
        ...prevTask,
        title: title,
      }));
    }
  };

  // State and handlers for changing the title
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // State and handlers for editing the description of the task
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  // State and handlers for description blur (when user finishes editing)
  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    setFullTask((prevTask) => ({
      ...prevTask,
      description: description,
    }));
  };

  // State and handlers for changing the description
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Function to handle priority change of the task
  const handlePriorityChange = (priority) => {
    setFullTask((prevTask) => ({
      ...prevTask,
      priority: priority,
    }));
  };

  // Function to close the modal and reset task details
  const handleCloseModal = () => {
    setFullTask(originalTask);
    setTitle(originalTask?.title);
    setDescription(originalTask?.description);
    setVisible(false);
    setError(null);
  };

  // Function to save task after editing
  const handleSave = async (e) => {
    e.preventDefault();
    const result = await updateTask(fullTask, fullTask.id);
    if (result.error) {
      setError(result.error);
      return;
    } else {
      const updatedTask = await getTask(fullTask.id);
      setOriginalTask(updatedTask);
      setVisible(false);
      refreshBoards();
      setError(null);
    }
  };

  // Function to handle task deletion
  const handleDeleteTask = async () => {
    const result = await deleteTask(fullTask, fullTask.id);
    if (result.error) {
      console.log(result.error);
    } else {
      setVisible(false);
      refreshBoards();
    }
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={handleCloseModal}
      size="lg"
    >
      {fullTask ? (
        <>
          <CModalHeader className={`${styles.modal_header}`}>
            <CModalTitle>
              {isEditingTitle ? (
                <CFormInput
                  type="text"
                  autoFocus
                  className={styles.title_input}
                  onBlur={handleTitleBlur}
                  onChange={handleTitleChange}
                  value={title}
                />
              ) : (
                <div className="d-flex flex-row gap-3 align-items-center">
                  <span
                    onClick={handleTitleClick}
                    style={{ fontWeight: "bold" }}
                  >
                    {title}
                  </span>
                  <CDropdown>
                    <CDropdownToggle
                      color="secondary"
                      style={{ backgroundColor: "transparent", border: "none" }}
                    >
                      {fullTask.priority === "1" && <FcLowPriority />}
                      {fullTask.priority === "2" && <FcMediumPriority />}
                      {fullTask.priority === "3" && <FcHighPriority />}
                    </CDropdownToggle>
                    <CDropdownMenu style={{ backgroundColor: "#313940" }}>
                      <CDropdownItem
                        style={{ color: "white" }}
                        onClick={() => handlePriorityChange("1")}
                      >
                        <FcLowPriority /> {t("modal:low")}
                      </CDropdownItem>
                      <CDropdownItem
                        style={{ color: "white" }}
                        onClick={() => handlePriorityChange("2")}
                      >
                        <FcMediumPriority /> {t("modal:medium")}
                      </CDropdownItem>
                      <CDropdownItem
                        style={{ color: "white" }}
                        onClick={() => handlePriorityChange("3")}
                      >
                        <FcHighPriority /> {t("modal:high")}
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              )}
            </CModalTitle>
          </CModalHeader>
          <CModalBody className={`d-flex flex-row ${styles.modal_body}`}>
            <section className={styles.input_section}>
              {/* Description */}
              <div
                className={`${styles.description_div} d-flex align-items-center gap-2 mb-3`}
              >
                <CIcon icon={cilDescription} size="xl" />
                <span>{t("modal:description")}</span>
              </div>
              <div className="mb-3">
                {isEditingDescription ? (
                  <CFormTextarea
                    className={styles.task_description_area}
                    value={description}
                    onBlur={handleDescriptionBlur}
                    onChange={handleDescriptionChange}
                  />
                ) : (
                  <span
                    onClick={handleDescriptionClick}
                    style={{ color: description ? "lightgray" : "gray" }}
                  >
                    {description ? description : t("modal:noDescription")}
                  </span>
                )}
              </div>

              <div>
                {/* Subtasks */}
                <Subtasks fullTask={fullTask} />

                {/* Comments */}
                <Comments fullTask={fullTask} />
              </div>
            </section>

            {/* Options section */}
            <section
              className={`d-flex flex-column align-items-end gap-2 ${styles.options_section}`}
            >
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
                onClick={() => setIsAssigning(true)}
              >
                <span>{t("modal:assign")}</span>
                <CIcon icon={cilUser} />
              </div>
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
              >
                <span onClick={handleSave}>{t("modal:save")}</span>
                <CIcon icon={cilPencil} />
              </div>
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
                onClick={() => setIsConfirmingDelete(true)}
              >
                <span>{t("modal:delete")}</span>
                <CIcon icon={cilTrash} />
              </div>
              <div className="d-flex flex-column w-75">
                {fullTask.asigned_to ? (
                  <>
                    <span>{t("modal:assigned")}</span>
                    <span style={{ fontStyle: "italic", color: "lightgray" }}>
                      {fullTask.asigned_to}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "lightgray" }}>
                      {t("modal:noAssigned")}
                    </span>
                  </>
                )}
              </div>
            </section>
          </CModalBody>

          {/* Confirm Delete Modal */}
          {isConfirmingDelete && (
            <ConfirmDeleteModal
              visible={isConfirmingDelete}
              setVisible={setIsConfirmingDelete}
              onConfirm={handleDeleteTask}
            />
          )}
          {isAssigning && (
            <AssignUserModal
              visible={isAssigning}
              setVisible={setIsAssigning}
              taskId={fullTask.id}
              onAssigned={async () => {
                const updatedTask = await getTask(fullTask.id);
                setFullTask(updatedTask);
                setOriginalTask(updatedTask);
              }}
            />
          )}
        </>
      ) : (
        <div>
          <CSpinner />
          {t("modal:loading")}
        </div>
      )}
    </CModal>
  );
};

// ConfirmDeleteModal Component
const ConfirmDeleteModal = ({ visible, setVisible, onConfirm }) => {
  const handleClose = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setVisible(false);
  };

  return (
    <CModal alignment="center" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Confirmación de Borrado</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          ¿Estás seguro de que deseas borrar esta tarea? Esta acción no se puede
          deshacer.
        </p>
        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Borrar
          </button>
        </div>
      </CModalBody>
    </CModal>
  );
};

const AssignUserModal = ({ visible, setVisible, taskId, onAssigned }) => {
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setVisible(false);
    setEmail("");
  };

  const handleAssign = async () => {
    const result = await changeAssignee(taskId, email);
    if (result.error) {
      alert(result.error);
    } else {
      onAssigned();
      handleClose();
    }
  };

  return (
    <CModal alignment="center" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Asignar tarea a un usuario</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          type="email"
          placeholder="Ingresa el email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="d-flex justify-content-end gap-3 mt-3">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleAssign}>
            Asignar
          </button>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default TaskModal;
