import { useDraggable } from "@dnd-kit/core";
import styles from "./KanbanCard.module.scss";

const KanbanCard = ({ id, column, task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { column, task },
  });

  const movement = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined
  };

  return (
    <div ref={setNodeRef} className={styles.kanban_card} style={movement} {...listeners} {...attributes}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <span className={styles.date}>📅 {task.created_at.date}</span>
    </div>
  );
};

export default KanbanCard;
