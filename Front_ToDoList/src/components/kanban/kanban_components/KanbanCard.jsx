import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import styles from "./KanbanCard.module.scss";
import TaskModal from "../../modals/TaskModal/TaskModal";
import { cilCalendar } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";

const KanbanCard = ({ id, column, task, refreshBoards }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { column, task },
    });

  const [clickTimeout, setClickTimeout] = useState(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  const handleMouseDown = () => {
    const timeout = setTimeout(() => {
      setClickTimeout(null);
    }, 200);
    setClickTimeout(timeout);
  };

  const handleMouseUp = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      setTaskModalVisible(true);
    }
  };

  const formattedDate = new Date(task.created_at.date).toLocaleDateString(
    "es-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const movement = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${
          isDragging ? "5deg" : "0deg"
        })`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  return (
    <>
      <TaskModal
        visible={taskModalVisible}
        setVisible={setTaskModalVisible}
        task={task}
        refreshBoards={refreshBoards}
      />
      <div
        ref={setNodeRef}
        className={styles.kanban_card}
        style={movement}
        {...listeners}
        {...attributes}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <h4>{task.title}</h4>
        <p>
          {task.description || (
            <span style={{ color: "grey" }}>Sin descripción</span>
          )}
        </p>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <CIcon icon={cilCalendar} size="lg" />
            <span className="ms-2">{formattedDate}</span>
          </div>
          {task.priority === "1" && <FcLowPriority />}
          {task.priority === "2" && <FcMediumPriority />}
          {task.priority === "3" && <FcHighPriority />}
        </div>
      </div>
    </>
  );
};

export default KanbanCard;
