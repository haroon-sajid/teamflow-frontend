import Layout from "../components/Layout";
import Kanban from "../components/Kanban";
import { useRef } from "react";

export default function CreateTaskPage() {
  const kanbanRef = useRef();

  const openCreateTaskModal = (taskId = null) => {
    if (kanbanRef.current && kanbanRef.current.openCreateModal) {
      kanbanRef.current.openCreateModal(taskId);
    }
  };

  return (
    <Layout>
      <div className="create-task-page-header">
        <div className="create-task-header-top">
          <h1>Create Tasks</h1>
          <button className="primary-btn" onClick={() => openCreateTaskModal()}>
            + Create Task
          </button>
        </div>
        <p className="subtitle">Manage and organize your tasks efficiently. Update to save progress—required for Dashboard & Reports tracking.</p>
        
      </div>
    
      <Kanban ref={kanbanRef} openTaskModal={openCreateTaskModal} />
    </Layout>
  );
}