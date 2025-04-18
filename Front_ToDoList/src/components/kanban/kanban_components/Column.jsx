import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";
import styles from "./Column.module.scss";

const Column = ({ id, tasks, refreshBoards }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={styles.column_div}>
      <h3>{id.toUpperCase()}</h3>
      {tasks.map((task) => (
        <KanbanCard key={task.title} id={task.title} column={id} task={task} refreshBoards={refreshBoards} />
      ))}
    </div>
  );
};

export default Column;
