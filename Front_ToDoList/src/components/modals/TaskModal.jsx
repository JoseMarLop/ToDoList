import {
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { getTask } from "../../data/task";
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

const TaskModal = ({ visible, setVisible, task }) => {
  const [fullTask, setTask] = useState(null);

  useEffect(() => {
    if (task?.id) {
      const handleTask = async () => {
        const result = await getTask(task.id);
        if (result.error) {
          alert(result.error);
        } else {
          setTask(result);
          setTitle(result.title);
        }
      };
      handleTask();
    }
  }, [task?.id]);

  //Tasks
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  //Subtasks
  const [hoveredSubtaskIndex, setHoveredSubtaskIndex] = useState(null);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleDeleteSubtask = (index) => {
    const updatedSubtasks = [...fullTask.subtasks];
    updatedSubtasks.splice(index, 1);
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: updatedSubtasks,
    }));
  };

  const handleSubtaskClick = () => {
    setIsAddingSubtask(true);
  };

  const handleSubtaskBlur = () => {
    setIsAddingSubtask(false);
  };

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
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
                <span onClick={handleTitleClick} style={{ fontWeight: "bold" }}>
                  {title}
                </span>
              )}
            </CModalTitle>
          </CModalHeader>
          <CModalBody className={`d-flex flex-row ${styles.modal_body}`}>
            {/* Input section */}
            <section className={styles.input_section}>
              {/* Description */}
              <div
                className={`${styles.description_div} d-flex align-items-center gap-2 mb-3`}
              >
                <CIcon icon={cilDescription} size="xl" />
                <span>Description</span>
              </div>
              <div className="mb-3">
                <CFormTextarea className={styles.task_description_area} value={fullTask.description}/>
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
                      <CFormInput className={styles.subtask_input}/>
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
                <span>Guardar</span>
                <CIcon icon={cilPencil} />
              </div>
              <div
                className={`w-75 d-flex align-items-center gap-2 ${styles.task_option_div}`}
              >
                <span>Borrar</span>
                <CIcon icon={cilTrash} />
              </div>
            </section>
          </CModalBody>
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

export default TaskModal;
