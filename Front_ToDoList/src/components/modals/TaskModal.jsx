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
import { getTask, updateTask, deleteTask } from "../../data/task";
import CIcon from "@coreui/icons-react";
import {
  cilDescription,
  cilList,
  cilPencil,
  cilPlus,
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

const TaskModal = ({ visible, setVisible, task }) => {
  const [fullTask, setFullTask] = useState(null);
  const [originalTask, setOriginalTask] = useState(null); // Estado para almacenar la tarea original
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // Estado para mostrar el modal de confirmación de borrado

  useEffect(() => {
    if (task?.id) {
      const handleTask = async () => {
        const result = await getTask(task.id);
        if (result.error) {
          alert(result.error);
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

  // Editing the title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    if (title.trim() === "") {
      setTitle(originalTask?.title || "");
      alert("El título no puede estar vacío.");
    } else {
      setIsEditingTitle(false);
      setFullTask((prevTask) => ({
        ...prevTask,
        title: title,
      }));
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Editing the description
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    setFullTask((prevTask) => ({
      ...prevTask,
      description: description,
    }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const [hoveredSubtaskIndex, setHoveredSubtaskIndex] = useState(null);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleDeleteSubtask = (index) => {
    const updatedSubtasks = [...fullTask.subtasks];
    updatedSubtasks.splice(index, 1);
    const updatedTask = { ...fullTask, subtasks: updatedSubtasks };
    setFullTask(updatedTask);
  };

  const handleSubtaskClick = () => {
    setIsAddingSubtask(true);
  };

  const handleSubtaskBlur = () => {
    setIsAddingSubtask(false);
  };

  const handlePriorityChange = (priority) => {
    setFullTask((prevTask) => ({
      ...prevTask,
      priority: priority,
    }));
  };

  const handleCloseModal = () => {
    setFullTask(originalTask);
    setTitle(originalTask?.title);
    setDescription(originalTask?.description);
    setVisible(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await updateTask(fullTask, fullTask.id);
    if (result.error) {
      alert(result.error);
      return;
    } else {
      alert("Tarea editada correctamente");
      setVisible(false);
    }
  };

  // Handle the deletion of the task
  const handleDeleteTask = async () => {
    const result = await deleteTask(fullTask,fullTask.id);
    if (result.error) {
      console.log(result.error);
    } else {
      alert("Tarea eliminada correctamente");
      setVisible(false);
    }
    // console.log(fullTask);
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={handleCloseModal} // Use the custom close handler
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
                        <FcLowPriority /> Baja
                      </CDropdownItem>
                      <CDropdownItem
                        style={{ color: "white" }}
                        onClick={() => handlePriorityChange("2")}
                      >
                        <FcMediumPriority /> Media
                      </CDropdownItem>
                      <CDropdownItem
                        style={{ color: "white" }}
                        onClick={() => handlePriorityChange("3")}
                      >
                        <FcHighPriority /> Alta
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
                <span>Description</span>
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
                    {description ? description : "No hay descripción"}
                  </span>
                )}
              </div>

              {/* Subtasks */}
              <div>
                <div
                  className={`${styles.description_div} d-flex align-items-center gap-2 mb-3`}
                >
                  <CIcon icon={cilList} size="xl" />
                  <span>Subtareas</span>
                </div>
                <div className="mb-3 w-50">
                  {fullTask.subtasks && fullTask.subtasks.length > 0 ? (
                    <ul>
                      {fullTask.subtasks.map((subtask, index) => (
                        <li
                          key={index}
                          onMouseEnter={() => setHoveredSubtaskIndex(index)}
                          onMouseLeave={() => setHoveredSubtaskIndex(null)}
                          className={styles.subtask_item}
                          style={{ color: "lightgray", cursor: "pointer" }}
                        >
                          {subtask.title}
                          {hoveredSubtaskIndex === index && (
                            <CIcon
                              icon={cilTrash}
                              size="sm"
                              onClick={() => handleDeleteSubtask(index)}
                              style={{
                                cursor: "pointer",
                                marginLeft: "10px",
                                color: "red",
                              }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{ color: "lightgray", fontSize: "14px" }}
                      className="ms-3"
                    >
                      No hay subtareas
                    </p>
                  )}
                  <div
                    className="d-flex gap-2 align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleSubtaskClick}
                    onBlur={handleSubtaskBlur}
                  >
                    {isAddingSubtask ? (
                      <CFormInput className={styles.subtask_input} />
                    ) : (
                      <>
                        <CIcon icon={cilPlus} />
                        <span style={{ color: "lightgray" }}>
                          Añadir subtarea
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div
                  className={`${styles.comments_div} d-flex align-items-center gap-2 mb-3`}
                >
                  <CIcon icon={cilSpeech} size="xl" />
                  <span>Comments</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className={styles.user_icon}>@</div>
                  <CFormInput className={styles.task_description_area} />
                </div>
              </div>
            </section>

            {/* Options section */}
            <section
              className={`d-flex flex-column align-items-end gap-2 ${styles.options_section}`}
            >
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
              >
                <span>Asignar</span>
                <CIcon icon={cilUser} />
              </div>
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
              >
                <span onClick={handleSave}>Guardar</span> {/* Trigger save */}
                <CIcon icon={cilPencil} />
              </div>
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
              >
                <span onClick={() => setIsConfirmingDelete(true)}>Borrar</span>
                <CIcon icon={cilTrash} />
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
        </>
      ) : (
        <div>
          <CSpinner />
          Cargando...
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

export default TaskModal;
