import { use, useEffect, useState } from "react";
import { addSubtask, getSubtasks, deleteSubtask } from "../../../data/task";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt, cilList, cilPlus, cilTrash, cilX } from "@coreui/icons";
import styles from "./TaskModal.module.scss";
import { CFormInput } from "@coreui/react";
import { useTranslation } from "react-i18next";

const Subtasks = ({ fullTask }) => {
  const { t } = useTranslation();

  /*
        ################################################################
        ######################### SUBTASKS #############################
        ################################################################
  */

  // State and handlers for managing subtasks
  const [hoveredSubtaskIndex, setHoveredSubtaskIndex] = useState(null);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [subtaskData, setSubtaskData] = useState({
    title: "",
  });
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState(null);

  const handleSubtasks = async () => {
    try {
      const result = await getSubtasks(fullTask.id);
      if (result.error) {
        setError(result.error);
      } else {
        setSubtasks(result);
      }
    } catch (error) {
      console.log("Error al obtener las subtareas");
      console.error(error);
    }
  };

  useEffect(() => {
    handleSubtasks();
  }, [fullTask.id]);

  const handleSubtaskChange = (e) => {
    const { name, value } = e.target;
    setSubtaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to add a new subtask to the task
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (subtaskData.title.trim() === "") {
      setError(t("modal:nonEmptyError"));
      return;
    }
    console.log(subtaskData);

    const result = await addSubtask(fullTask.id, subtaskData);
    if (result.error) {
      setError(result.error);
    } else {
      setSubtaskData({
        title: "",
      });
      setIsAddingSubtask(false);
      handleSubtasks();
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    const result = deleteSubtask(subtaskId);

    if (result.error) {
      setError(result.error);
    } else {
      handleSubtasks();
    }
  };

  return (
    <>
      <div
        className={`${styles.description_div} d-flex align-items-center gap-2 mb-3`}
      >
        <CIcon icon={cilList} size="xl" />
        <span>{t("modal:subtasks")}</span>
      </div>
      <div className="mb-3 w-50">
        {subtasks && subtasks.length > 0 ? (
          <ul>
            {subtasks.map((subtask, index) => (
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
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      color: "red",
                    }}
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "lightgray", fontSize: "14px" }} className="ms-3">
            {t("modal:noSubtasks")}
          </p>
        )}
        {isAddingSubtask ? (
          <div className="d-flex flex-row align-items-center gap-2">
            <CFormInput
              className={styles.subtask_input}
              name="title"
              value={subtaskData.title}
              onChange={handleSubtaskChange}
            />
            <CIcon
              icon={cilCheckAlt}
              size="xxl"
              className="mt-2"
              onClick={handleAddSubtask}
            />
            <CIcon
              icon={cilX}
              size="xxl"
              className="mt-2"
              onClick={() => {
                setIsAddingSubtask(false);
                setSubtaskData({ title: "" });
                setError(null);
              }}
            />
          </div>
        ) : (
          <div
            className="d-flex gap-2 align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setIsAddingSubtask(true)}
          >
            <CIcon icon={cilPlus} />
            <span style={{ color: "lightgray" }}>{t("modal:addSubtask")}</span>
          </div>
        )}
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </>
  );
};

export default Subtasks;
