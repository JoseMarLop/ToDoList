import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./kanban_components/Column";
import CIcon from "@coreui/icons-react";
import { cilPencil } from "@coreui/icons";
import NewTable from "../modals/TableModal";
import TableModal from "../modals/TableModal";

const KanbanBoard = ({ board, refreshBoards }) => {
  const [columns, setColumns] = useState({
    todo: [],
    doing: [],
    review: [],
    done: [],
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (board && board.tasks) {
      const tasksByStatus = { todo: [], doing: [], review: [], done: [] };
      board.tasks.forEach((task) => {
        if (tasksByStatus[task.status]) {
          tasksByStatus[task.status].push(task);
        }
      });
      setColumns(tasksByStatus);
    }
  }, [board]);

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
  }

  return (
    <>
      <TableModal visible={visible} setVisible={setVisible} board={board} mode='edit' refreshBoards={refreshBoards}/>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="d-flex flex-row align-items-center">
          <h2>{board.name}</h2>
          <CIcon
            icon={cilPencil}
            className="ms-3"
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={() => setVisible(true)}
          />
        </div>
        <p>{board.description}</p>
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.keys(columns).map((col) => (
            <Column key={col} id={col} tasks={columns[col]} />
          ))}
        </div>
      </DndContext>
    </>
  );
};

export default KanbanBoard;
