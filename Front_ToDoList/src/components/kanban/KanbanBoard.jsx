import React from "react";

import { DndContext,useDraggable,useDroppable } from "@dnd-kit/core";
// import Draggable from "./kanban_components/Draggable";
// import Droppable from "./kanban_components/Droppable";
const KanbanBoard = () => {
    const [columns, setColumns] = React.useState({
      todo: ["Tarea 1", "Tarea 2"],
      doing: ["Tarea 3"],
      review: ["Tarea 4"],
      done: ["Tarea 5"],
    });
  
    function handleDragEnd(event) {
      const { active, over } = event;
      if (!over) return;
  
      const fromColumn = active.data.current.column;
      const toColumn = over.id;
  
      if (fromColumn === toColumn) return; // Evitar mover a la misma columna
  
      const task = active.data.current.task;
  
      setColumns((prev) => {
        const newColumns = { ...prev };
        newColumns[fromColumn] = newColumns[fromColumn].filter((t) => t !== task);
        newColumns[toColumn] = [...newColumns[toColumn], task];
        return newColumns;
      });
    }
  
    return (
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.keys(columns).map((col) => (
            <Column key={col} id={col} tasks={columns[col]} />
          ))}
        </div>
      </DndContext>
    );
  };
  
  const Column = ({ id, tasks }) => {
    const { setNodeRef } = useDroppable({ id });
  
    return (
      <div ref={setNodeRef} style={columnStyle}>
        <h3>{id.toUpperCase()}</h3>
        {tasks.map((task) => (
          <Draggable key={task} id={task} column={id} task={task} />
        ))}
      </div>
    );
  };
  
  const Draggable = ({ id, column, task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
      data: { column, task },
    });
  
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      ...taskStyle,
    };
  
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {task}
      </div>
    );
  };
  
  // Estilos básicos
  const columnStyle = {
    width: "25%",
    minHeight: "300px",
    border: "1px solid black",
    padding: "10px",
    backgroundColor: "#f0f0f0",
  };
  
  const taskStyle = {
    padding: "10px",
    margin: "5px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    cursor: "grab",
  };
  
  export default KanbanBoard;
