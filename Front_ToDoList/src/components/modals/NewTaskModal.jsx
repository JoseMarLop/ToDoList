import { cilCommentBubble, cilDescription } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { addTask } from "../../data/task";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";

const NewTaskModal = ({ visible, setVisible, board , refreshBoards}) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "1",
    table_id: board.id,
  });

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
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (taskData.title.trim() === "") {
      alert("El título de la tarea no puede estar en blanco");
      return;
    }
    console.log("taskData antes de la solicitud:", taskData);
    const result = await addTask(taskData);
    if (result.error) {
      alert(result.error);
      return;
    } else {
      refreshBoards();
      setVisible(false);
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
      onClose={() => setVisible(false)}
    >
      <CModalHeader>
        <CModalTitle>Añadir tarea</CModalTitle>
        <span>Board id: {board.id}</span>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Title */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilCommentBubble} />
            </CInputGroupText>
            <CFormInput
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder="Título"
            />
          </CInputGroup>

          {/* Description */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilDescription} />
            </CInputGroupText>
            <CFormTextarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              placeholder="Descripción"
            />
          </CInputGroup>

          {/* Priority */}
          <div className="mb-3 w-50">
            <CInputGroup>
              <CInputGroupText>{getPriorityIcon()}</CInputGroupText>
              <select
                className="form-select"
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
              >
                <option value="1">Baja</option>
                <option value="2">Media</option>
                <option value="3">Alta</option>
              </select>
            </CInputGroup>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cerrar
        </CButton>
        <CButton color="primary" onClick={handleAddTask}>
          Guardar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default NewTaskModal;
