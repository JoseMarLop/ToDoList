import { CModal } from "@coreui/react";

const TaskModal = ({visible,setVisible}) => {
    return (
        <CModal
              alignment="center"
              visible={visible}
              onClose={() => setVisible(false)}
            >
                <h1>Tarea</h1>
            </CModal>
    );
}

export default TaskModal;