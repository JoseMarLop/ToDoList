import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./kanban_components/Column";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilPlus, cilUser } from "@coreui/icons";
import TableModal from "../modals/TableModal/TableModal.jsx";
import NewTaskModal from "../modals/NewTaskModal/NewTaskModal.jsx";
import MemberModal from "../modals/MemberModal/MemberModal";
import { changeTaskStatus } from "../../data/task";
import styles from "./KanbanBoard.module.scss";
import { useTranslation } from "react-i18next";

const KanbanBoard = ({ board, refreshBoards }) => {
    const { t } = useTranslation(); // Hook for translations
  
  const [columns, setColumns] = useState({
    todo: [],
    doing: [],
    review: [],
    done: [],
  });

  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (board && board.tasks) {
      const tasksByStatus = { todo: [], doing: [], review: [], done: [] };

      board.tasks.forEach((task) => {
        if (priorityFilter === "all" || task.priority === priorityFilter) {
          if (tasksByStatus[task.status]) {
            tasksByStatus[task.status].push(task);
          }
        }
      });

      setColumns(tasksByStatus);
    }
  }, [board, priorityFilter]); 

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const fromColumn = active.data.current.column;
    const toColumn = over.id;

    if (fromColumn === toColumn) return;

    const task = active.data.current.task;

    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[fromColumn] = newColumns[fromColumn].filter(
        (t) => t.id !== task.id
      );
      newColumns[toColumn] = [
        ...newColumns[toColumn],
        { ...task, status: toColumn },
      ];
      return newColumns;
    });

    changeTaskStatus(task.id, toColumn)
      .then((data) => {
        if (data.error) {
          console.error(
            "Error al actualizar el estado de la tarea",
            data.error
          );
        } else {
          refreshBoards(); 
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud de cambio de estado", error);
      });
  }

  return (
    <>
      <MemberModal
        visible={memberModalVisible}
        setVisible={setMemberModalVisible}
        board={board}
        refreshBoards={refreshBoards}
      />
      <TableModal
        visible={tableModalVisible}
        setVisible={setTableModalVisible}
        board={board}
        mode="edit"
        refreshBoards={refreshBoards}
      />
      <NewTaskModal
        visible={taskModalVisible}
        setVisible={setTaskModalVisible}
        board={board}
        refreshBoards={refreshBoards}
      />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="d-flex flex-row align-items-center">
          <h2 className={styles.board_text}>{board.name}</h2>
          {board.user_rol === "admin" ? (
            <CIcon
              icon={cilPencil}
              className={`${styles.board_text} ms-3`}
              size="lg"
              style={{ cursor: "pointer" }}
              onClick={() => setTableModalVisible(true)}
            />
          ) : (
            <></>
          )}
        </div>
        <p className={styles.board_text}>{board.description}</p>
        <div
          className="w-25 d-flex flex-row align-items-center gap-2 mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => setMemberModalVisible(true)}
        >
          <CIcon icon={cilUser} size="lg" className={styles.board_text} />
          <span className={styles.board_text}>{t("kanban:members")}</span>
        </div>
        <div
          className="d-flex flex-row align-items-center gap-2 mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => setTaskModalVisible(true)}
        >
          <CIcon icon={cilPlus} size="lg" className={styles.board_text} />
          <span className={styles.board_text}>{t("kanban:addTask")}</span>
        </div>
        <div className="mb-3">
          <label className={styles.board_text}>{t("kanban:filterPriority")}</label>
          <select
            className="form-select w-auto ms-2 d-inline"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">{t("kanban:allTasks")}</option>
            <option value="1">{t("kanban:lowPriority")}</option>
            <option value="2">{t("kanban:mediumPriority")}</option>
            <option value="3">{t("kanban:highPriority")}</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.keys(columns).map((col) => (
            <Column
              key={col}
              id={col}
              tasks={columns[col]}
              refreshBoards={refreshBoards}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
};

export default KanbanBoard;
