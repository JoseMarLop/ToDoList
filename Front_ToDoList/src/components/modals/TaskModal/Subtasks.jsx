import { use, useEffect, useState } from "react";
import { addSubtask,getSubtasks,deleteSubtask } from "../../../data/task";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt, cilList, cilPlus, cilTrash, cilX } from "@coreui/icons";
import styles from "./TaskModal.module.scss";
import { CFormInput } from "@coreui/react";

const Subtasks = ({ fullTask }) => {
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
  
  const handleSubtasks = async () => {
    try {
        const result = await getSubtasks(fullTask.id); 
        if (result.error) {
            console.log(result.error); 
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
      alert("El título de la subtarea no puede estar vacío.");
      return;
    }
    console.log(subtaskData);

    const result = await addSubtask(fullTask.id, subtaskData);
    if (result.error) {
      alert(result.error);
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

    if(result.error){
        console.log(result.error);
    }else{
        // alert("Borrado exitoso");
        handleSubtasks();
    }
  }

  return (
    <>
      <div
        className={`${styles.description_div} d-flex align-items-center gap-2 mb-3`}
      >
        <CIcon icon={cilList} size="xl" />
        <span>Subtareas</span>
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
            No hay subtareas
          </p>
        )}
        <div
          className="d-flex gap-2 align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setIsAddingSubtask(true)}
        >
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
                onClick={() => {}}
              />
            </div>
          ) : (
            <>
              <CIcon icon={cilPlus} />
              <span style={{ color: "lightgray" }}>Añadir subtarea</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Subtasks;
