import { cilSpeech, cilTrash, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import styles from "./TaskModal.module.scss";
import { getComments, addComment, deleteComment } from "../../../data/comment";
import { useEffect, useState } from "react";
import {useTranslation} from "react-i18next";


const Comments = ({ fullTask }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [error, setError] = useState(null);

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
      e.preventDefault();
      setLoading(true);

      const result = await addComment(fullTask.id, content.trim());

      if (!result.error) {
        setContent("");
        await fetchComments();
      } else {
        setError("Error al añadir comentario:", result.error);
      }

      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleDeleteComment = async (commentId) => {
    const result = await deleteComment(commentId);

    if (!result.error) {
      await fetchComments();
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      {/* Comments */}
      <div
        className={`${styles.comments_div} d-flex align-items-center gap-2 mb-3`}
      >
        <CIcon icon={cilSpeech} size="xl" />
        <span>{t("modal:comments")}</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className={styles.user_icon}>@</div>
        <CFormInput
          className={styles.task_description_area}
          value={content}
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={t("modal:writeComment")}
        />
      </div>

      {/* Render comments */}
      <div className="mt-3">
        {comments.map((comment, index) => (
          <div key={index} className="mb-4 d-flex flex-row align-items-center">
            <div>
              <CIcon icon={cilUser} size="xl" />
            </div>
            <div className="ms-3">
              <div className="d-flex flex-column" style={{ cursor: "pointer" }}>
                <div className="d-flex flex-row align-items-center gap-2">
                  <span style={{ color: "gray", fontSize: "14px" }}>
                    {comment.user}
                  </span>
                  <span style={{ color: "gray", fontSize: "14px" }}>
                    {formatDate(comment.created_at.date)}
                  </span>
                </div>
                <span>{comment.content}</span>
                <CIcon
                  icon={cilTrash}
                  className="mt-1"
                  style={{ cursor: "pointer", color: "gray" }}
                  onClick={() => {
                    setCommentToDelete(comment.id); // o comment.comment_id si tiene otro nombre
                    setShowModal(true);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete comment modal */}

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalBody>
        {t("modal:deleteComment")}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
          {t("modal:cancel")}
          </CButton>
          <CButton
            color="danger"
            onClick={async () => {
              if (commentToDelete) {
                const result = await deleteComment(commentToDelete);
                if (!result.error) {
                  await fetchComments();
                } else {
                  setError("Error al eliminar comentario:", result.error);
                }
              }
              setShowModal(false);
              setCommentToDelete(null);
            }}
          >
            {t("modal:delete")}
          </CButton>
        </CModalFooter>
      </CModal>
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
