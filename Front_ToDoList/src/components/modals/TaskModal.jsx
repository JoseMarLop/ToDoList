import { cilCommentBubble } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
    CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useState } from "react";
import { addTask } from "../../data/task";

const TaskModal = ({ visible, setVisible, board }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    table_id: board.id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (taskData.title.trim() === "") {
      alert("El título de la tarea no puede estar en blanco");
      return;
    }
    const result = await addTask(taskData);
    if(result.error){
      alert(result.error);
      return;
    }else{
        alert("Tarea añadida correctamente");
        setVisible(false);
    }
  };
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>
        <CModalTitle>Añadir tarea</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilCommentBubble} />
            </CInputGroupText>
            <CFormInput
              name="title"
              value={taskData.title}
              onChange={handleChange}
            />
          </CInputGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton
          color="primary"
          onClick={handleAddTask}
        >
          Save changes
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TaskModal;
