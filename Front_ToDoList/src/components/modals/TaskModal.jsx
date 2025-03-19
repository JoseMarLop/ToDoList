import {
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { getTask } from "../../data/task";
import CIcon from "@coreui/icons-react";
import { cilDescription, cilPencil, cilSpeech, cilTrash, cilUser } from "@coreui/icons";
import styles from "./TaskModal.module.scss";

const TaskModal = ({ visible, setVisible, task }) => {
  const [fullTask, setTask] = useState(null);

  useEffect(() => {
    if (task?.id) {
      const handleTask = async () => {
        const result = await getTask(task.id);
        if (result.error) {
          alert(result.error);
        } else {
          setTask(result);
        }
      };
      handleTask();
    }
  }, [task?.id]);

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
    >
      {fullTask ? (
        <>
          <CModalHeader>
            <CModalTitle>
              <span style={{ fontWeight: "bold" }}>{fullTask.title}</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="d-flex flex-row">
            <section style={{width: "75%"}}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <CIcon icon={cilDescription} size="xl" />
                <span>Description</span>
              </div>
              <div></div>
              <div className="mb-3">
                <CFormTextarea />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <CIcon icon={cilSpeech} size="xl" />
                  <span>Comments</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className={styles.user_icon}>@</div>
                  <CFormInput />
                </div>
                <div></div>
              </div>
            </section>

            <section style={{width: "25%"}} className="d-flex flex-column align-items-end gap-2">
                <div className="w-75 d-flex align-items-center gap-2" style={{backgroundColor: "red", paddingRight:'60px',paddingTop:'2px',paddingBottom:'2px' ,paddingLeft:'2px'}}>
                    <span>Asignar</span>
                    <CIcon icon={cilUser} />
                </div >
                <div className="w-75 d-flex align-items-center gap-2" style={{backgroundColor: "red", paddingRight:'60px',paddingTop:'2px',paddingBottom:'2px' ,paddingLeft:'2px'}}>
                    <span>Editar</span>
                    <CIcon icon={cilPencil} />
                </div>
                <div className="w-75 d-flex align-items-center gap-2" style={{backgroundColor: "red", paddingRight:'60px',paddingTop:'2px',paddingBottom:'2px' ,paddingLeft:'2px'}}>
                    <span>Borrar</span>
                    <CIcon icon={cilTrash} />
                </div>
            </section>
          </CModalBody>
        </>
      ) : (
        <div>
          <CSpinner />
          Cargando...
        </div>
      )}
    </CModal>
  );
};

export default TaskModal;
