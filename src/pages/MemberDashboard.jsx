import Layout from "../components/Layout";
import { useEffect, useState, useContext } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/modals/TaskModal";
import { getTasks, updateTask } from "../api/tasks.js";
import { getProjects } from "../api/projects.js";
import { getUsers } from "../api/users.js";
import { updateTaskStatusOnly } from "../api/tasks.js";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// const COLUMNS = ["Open", "To Do", "In Progress", "In QA", "Done"];

export default function MemberDashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState('view');

  const memberId = user?.id || localStorage.getItem("userId");
  const userName = user?.full_name || localStorage.getItem("userName") || "Member";
  const userOrgId = user?.organization_id || parseInt(localStorage.getItem("organizationId"));

  // Load all data function
  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load tasks
      const tasksData = await getTasks();
      const userTasks = tasksData.filter(task => 
        task.member_ids?.includes(memberId) || task.member_id === memberId
      );

      const statusMap = {
        open: "Open",
        todo: "To Do",
        "in-progress": "In Progress",
        inprogress: "In Progress",
        qa: "In QA",
        done: "Done",
      };

      const normalized = userTasks.map((t) => ({
        ...t,
        status: statusMap[t.status?.toLowerCase().replace(/[-\s]/g, "")] || "Open",
      }));

      setTasks(normalized);

      // Load projects
      const projectsData = await getProjects();
      setProjects(projectsData || []);

      // Check user role before fetching users
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin" || user?.role === "super_admin") {
        // Admins and Super Admins can fetch users
        try {
          const usersData = await getUsers();
          // Filter users by organization
          const orgUsers = usersData.filter(u => u.organization_id === userOrgId);
          setUsers(orgUsers);
        } catch (error) {
          console.warn("⚠️ Could not fetch users, using minimal user set:", error.message);
          
          // If member can't access all users, create a minimal users array
          // This prevents logout and allows tasks to render
          const minimalUsers = [
            {
              id: parseInt(memberId),
              full_name: user?.full_name || userName,
              email: user?.email || 'member@example.com',
              organization_id: userOrgId,
              role: 'member'
            }
          ];

          // Add other assigned members from tasks
          const memberIds = new Set();
          normalized.forEach(task => {
            if (task.member_ids) {
              task.member_ids.forEach(id => {
                if (id !== parseInt(memberId)) {
                  memberIds.add(id);
                }
              });
            }
          });

          memberIds.forEach(id => {
            minimalUsers.push({
              id: id,
              full_name: `Team Member ${id}`,
              email: `member${id}@example.com`,
              organization_id: userOrgId,
              role: 'member'
            });
          });

          setUsers(minimalUsers);
        }
      } else {
        // Members don't fetch users list - prevent the 403 call entirely
        setUsers([]);
      }
      
    } catch (e) {
      console.error("❌ loadAllData error:", e);
      toast.error("Failed to load data");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId && userOrgId) {
      loadAllData();
    }
  }, [memberId, userOrgId]);



// src/components/MemberDashboard.jsx  (top of file, after imports)
const COLUMNS = ["Open", "To Do", "In Progress", "In QA", "Done"];

const reverseStatusMap = {
  "Open": "open",
  "To Do": "todo",
  "In Progress": "in-progress",
  "In QA": "qa",
  "Done": "done",
};


const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const statusMap = {
      "Open": "Open",
      "To Do": "To Do",
      "In Progress": "In Progress",
      "In QA": "In QA",
      "Done": "Done"
    };

    const normalizedStatus = statusMap[newStatus] || newStatus;

    // ✅ Try minimal status-only update first (safe for members)
    let updatedTask;
    try {
      updatedTask = await updateTask(taskId, normalizedStatus);
    } catch (error) {
      // If backend doesn’t have /status endpoint, fall back to full PUT
      if (error.message.includes("405") || error.message.includes("Method Not Allowed")) {
        updatedTask = await updateTask(taskId, { status: normalizedStatus });
      } else {
        throw error;
      }
    }

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus }
          : t
      )
    );

    toast.success(`Task status updated to "${newStatus}"`);
  } catch (e) {
    console.error("Error updating task status:", e);
    toast.error(e.message || "Failed to update task status");
  }
};


  

  // Task Modal Functions
  const openViewTaskModal = (task) => {
    setSelectedTask(task);
    setModalMode('view');
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setModalMode('edit');
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
    setModalMode('view');
  };

  
  //  handleSaveTask
const handleSaveTask = async (taskData) => {
  try {
    // Determine frontend role
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : {};
    const role = currentUser.role || localStorage.getItem("userRole") || "member";

    // Normalize status mapping to backend-friendly value
    const reverseStatusMap = {
      "Open": "open",
      "To Do": "todo",
      "In Progress": "in-progress",
      "In QA": "qa",
      "Done": "done",
    };

    const backendStatus = reverseStatusMap[taskData.status] || (taskData.status || "").toLowerCase().replace(/\s+/g, "-");

    if (role === "member") {
      // Member: allowed to change status only — call PATCH endpoint
      const updated = await updateTaskStatusOnly(selectedTask.id, backendStatus);

      // Normalize returned status for UI
      const statusMap = {
        open: "Open",
        todo: "To Do",
        "in-progress": "In Progress",
        inprogress: "In Progress",
        qa: "In QA",
        done: "Done",
      };

      const normalized = {
        ...selectedTask,
        ...updated,
        status: statusMap[updated.status?.toLowerCase().replace(/[-\s]/g, "")] || updated.status || taskData.status
      };

      setTasks(prev => prev.map(t => t.id === selectedTask.id ? normalized : t));
      toast.success("Task status updated");
      closeTaskModal();
      return;
    }

    // Admin path: full update allowed
    const updatedTask = await updateTask(selectedTask.id, taskData);
    // Normalize status for UI (same mapping)
    const statusMap = {
      open: "Open",
      todo: "To Do",
      "in-progress": "In Progress",
      inprogress: "In Progress",
      qa: "In QA",
      done: "Done",
    };
    const normalizedTask = {
      ...updatedTask,
      status: statusMap[updatedTask.status?.toLowerCase().replace(/[-\s]/g, "")] || updatedTask.status
    };
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? normalizedTask : t));
    toast.success("Task updated successfully");
    closeTaskModal();

  } catch (error) {
    console.error("Error updating task:", error);
    toast.error(error.message || "Failed to update task");
  }
};



  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.message || "Failed to delete task");
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e, newStatus) => {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');

  if (!draggedTask || draggedTask.status === newStatus) {
    setDraggedTask(null);
    return;
  }

  try {
    //  member-safe status-only patch
    await updateTaskStatusOnly(draggedTask.id, reverseStatusMap[newStatus]);
    setTasks(prev =>
      prev.map(t => (t.id === draggedTask.id ? { ...t, status: newStatus } : t))
    );
    toast.success(`Task moved to ${newStatus}`);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setDraggedTask(null);
  }
};


  return (
    <Layout>
      <div className="page-header">
        <h1>Hello, {userName} 👋</h1>
        <p>Manage your assigned tasks across projects.</p>
        
        {user?.role && (
          <div className={`role-badge ${user.role}`}>
            {user.role === 'member' && '👤 Team Member'}
            {user.role === 'admin' && '🛠️ Administrator'} 
            {user.role === 'super_admin' && '🛡️ Super Administrator'}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading your tasks...</p>
        </div>
      ) : (
        <section className="kanban-board">
          <div className="kanban-columns">
            {COLUMNS.map((col) => (
              <TaskCard
                key={col}
                title={col}
                tasks={tasks.filter((t) => t.status === col)}
                onAdd={null}
                onEdit={openEditTaskModal}
                onView={openViewTaskModal}
                onDelete={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col)}
                showAddButton={false}
                users={users}
              />
            ))}
          </div>
        </section>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={closeTaskModal}
          onSave={handleSaveTask}
          editing={selectedTask}
          column={selectedTask?.status}
          projects={projects}
          users={users}
          viewOnly={modalMode === 'view'}
        />
      )}
    </Layout>
  );
}

