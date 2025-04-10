import { cilSpeech, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CFormInput } from "@coreui/react";
import styles from "./TaskModal.module.scss";
import { getComments,addComment } from "../../../data/comment";
import { useEffect, useState } from "react";

const Comments = ({ fullTask }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    if (fullTask?.id) {
      const taskComments = await getComments(fullTask.id);
      setComments(taskComments);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fullTask]);

  const handleCommentChange = (e) => {
    setContent(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && content.trim() && fullTask?.id) {
      e.preventDefault(); // evita el comportamiento por defecto del enter en formularios
      setLoading(true);

      const result = await addComment(fullTask.id, content.trim());

      if (!result.error) {
        setContent("");
        await fetchComments(); // Recarga los comentarios
      } else {
        console.error("Error al añadir comentario:", result.error);
      }

      setLoading(false);
    }
  };

  return (
    <>
      {/* Comments */}
      <div
        className={`${styles.comments_div} d-flex align-items-center gap-2 mb-3`}
      >
        <CIcon icon={cilSpeech} size="xl" />
        <span>Comments</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className={styles.user_icon}>@</div>
        <CFormInput
          className={styles.task_description_area}
          value={content}
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Escribe un comentario y presiona Enter"
        />
      </div>

      {/* Render comments */}
      <div className="mt-3">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="mb-2 d-flex flex-row align-items-center"
          >
            <div>
              <CIcon icon={cilUser} size="xl" />
            </div>
            <div className="ms-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-row align-items-center gap-2">
                  <span style={{ color: "gray", fontSize: "14px" }}>
                    {comment.user}
                  </span>
                  <span style={{ color: "gray", fontSize: "14px" }}>
                    {formatDate(comment.created_at.date)}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default Comments;
