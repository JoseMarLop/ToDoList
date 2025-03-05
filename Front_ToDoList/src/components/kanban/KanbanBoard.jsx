import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./kanban_components/Column";

const KanbanBoard = ({ board }) => {
  const [columns, setColumns] = useState({ todo: [], doing: [], review: [], done: [] });

  useEffect(() => {
    if (board) {
      const tasksByStatus = { todo: [], doing: [], review: [], done: [] };
      board.tasks.forEach((task) => {
        tasksByStatus[task.status].push(task);
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
      newColumns[fromColumn] = newColumns[fromColumn].filter((t) => t.title !== task.title);
      newColumns[toColumn] = [...newColumns[toColumn], { ...task, status: toColumn }];
      return newColumns;
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h2>{board.title}</h2>
      <p>{board.description}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        {Object.keys(columns).map((col) => (
          <Column key={col} id={col} tasks={columns[col]} />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
