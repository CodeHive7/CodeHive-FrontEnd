import { useState, useEffect } from "react";
import { fetchAssignedTasks, updateTaskStatus } from "../../../services/userService/UserService";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ClipboardList, CheckCircle, Loader2, XCircle, Info, AlertTriangle, Calendar, Flag } from "lucide-react";
import Swal from "sweetalert2";

const TaskTypes = { TASK: "TASK" };

export default function AssignedTasksPage() {
    const [tasks, setTasks] = useState({ TODO: [], DOING: [], DONE: [] });
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await fetchAssignedTasks();
            const groupedTasks = { TODO: [], DOING: [], DONE: [] };
            data.forEach((task) => groupedTasks[task.status].push(task));
            setTasks(groupedTasks);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await updateTaskStatus(taskId, status);
            Swal.fire({
                icon: "success",
                title: "Task Updated",
                text: `Task successfully moved to ${status}`,
                timer: 2000,
                showConfirmButton: false,
                background: "#111827",
                color: "#ffffff"
            });
            loadTasks();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Failed to update task status. Please check your connection and try again.",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading your tasks...</p>
            </div>
        );
    }

    const allTasksEmpty = Object.values(tasks).every(column => column.length === 0);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">
                    <span className="text-amber-500">My</span>
                    <span className="text-white"> Assigned </span>
                    <span className="text-amber-400">Tasks</span>
                </h2>

                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md overflow-hidden">
                    {/* Board Header */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-6 border-b border-amber-500/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/20 p-2 rounded-md">
                                <ClipboardList className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">Task Board</h3>
                                <p className="text-gray-400 text-sm">Drag tasks to update their status</p>
                            </div>
                        </div>
                    </div>

                    {/* Task Board */}
                    <div className="p-6">
                        {allTasksEmpty ? (
                            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-amber-500/20 rounded-lg">
                                <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                    <AlertTriangle className="w-10 h-10 text-amber-500/70" />
                                </div>
                                <p className="text-gray-400 text-lg">No tasks available</p>
                                <p className="text-gray-500 text-sm mt-1">When tasks are assigned to you, they will appear here</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(tasks).map(([status, taskList]) => (
                                    <TaskColumn key={status} status={status} tasks={taskList} onDropTask={handleStatusChange} setSelectedTask={setSelectedTask} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Background pattern */}
                <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                        backgroundSize: "112px 200px"
                    }}>
                </div>
            </div>
            {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
        </DndProvider>
    );
}

function TaskColumn({ status, tasks, onDropTask, setSelectedTask }) {
    const [{ isOver }, drop] = useDrop({
        accept: TaskTypes.TASK,
        drop: (item) => onDropTask(item.id, status),
        collect: (monitor) => ({ isOver: monitor.isOver() }),
    });

    const getColumnStyles = () => {
        if (status === "TODO") {
            return {
                headerBg: "bg-amber-500/20",
                borderColor: "border-amber-500/50",
                icon: <XCircle className="w-5 h-5 text-amber-400" />,
                hoverBg: "bg-amber-500/10"
            };
        } else if (status === "DOING") {
            return {
                headerBg: "bg-blue-500/20",
                borderColor: "border-blue-500/50",
                icon: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
                hoverBg: "bg-blue-500/10"
            };
        } else {
            return {
                headerBg: "bg-green-500/20",
                borderColor: "border-green-500/50",
                icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                hoverBg: "bg-green-500/10"
            };
        }
    };

    const styles = getColumnStyles();
    
    const getColumnTitle = () => {
        switch (status) {
            case "TODO": return "To Do";
            case "DOING": return "In Progress";
            case "DONE": return "Completed";
            default: return status;
        }
    };

    return (
        <div
            ref={drop}
            className={`rounded-md overflow-hidden transition ${isOver ? styles.hoverBg : "bg-gray-950"} border ${styles.borderColor} shadow-md`}
        >
            <div className={`p-4 ${styles.headerBg} flex items-center gap-2 border-b border-gray-700`}>
                {styles.icon}
                <h3 className="text-lg font-semibold text-white">
                    {getColumnTitle()}
                </h3>
                <span className="ml-auto text-xs bg-black/30 text-gray-300 px-2 py-1 rounded-md">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
            </div>

            <div className="p-4 min-h-[250px]">
                {tasks.length > 0 ? (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} setSelectedTask={setSelectedTask} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <p className="text-gray-400 text-sm">No tasks yet</p>
                        <p className="text-gray-500 text-xs mt-1">Drag tasks here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskCard({ task, setSelectedTask }) {
    const [{ isDragging }, drag] = useDrag({
        type: TaskTypes.TASK,
        item: { id: task.id },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const getPriorityStyles = () => {
        switch(task.priority) {
            case "HIGH":
                return "border-l-4 border-red-500 bg-red-500/10";
            case "MEDIUM":
                return "border-l-4 border-amber-500 bg-amber-500/10";
            default:
                return "border-l-4 border-green-500 bg-green-500/10";
        }
    };

    const priorityIcons = {
        HIGH: "🔥",
        MEDIUM: "⚡",
        LOW: "🐢"
    };

    return (
        <div
            ref={drag}
            onClick={() => setSelectedTask(task)}
            className={`p-3 rounded-md cursor-pointer transition-all transform hover:translate-y-[-2px] hover:shadow-lg ${isDragging ? "opacity-50" : "opacity-100"} ${getPriorityStyles()} bg-gray-950 hover:bg-gray-900`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{task.title}</h4>
                <span className="text-xs rounded-md px-1.5 py-0.5 bg-black/30 text-gray-300">
                    {priorityIcons[task.priority]}
                </span>
            </div>
            {task.dueDate && (
                <div className="text-xs flex items-center text-gray-400 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
}

function TaskModal({ task, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-md shadow-xl border border-amber-500/30 w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 border-b border-amber-500/30 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Task Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XCircle className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5">
                    <div className="mb-4">
                        <h3 className="text-2xl font-semibold text-white mb-2">{task.title}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                                ${task.priority === "HIGH" ? "bg-red-500/20 text-red-400" : 
                                  task.priority === "MEDIUM" ? "bg-amber-500/20 text-amber-400" : 
                                  "bg-green-500/20 text-green-400"}`}
                            >
                                <Flag className="w-3 h-3 mr-1" /> {task.priority} Priority
                            </span>
                            {task.status && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                                    ${task.status === "DONE" ? "bg-green-500/20 text-green-400" : 
                                      task.status === "DOING" ? "bg-blue-500/20 text-blue-400" : 
                                      "bg-amber-500/20 text-amber-400"}`}
                                >
                                    {task.status === "DONE" ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                     task.status === "DOING" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> :
                                     <XCircle className="w-3 h-3 mr-1" />}
                                    {task.status === "DOING" ? "In Progress" : 
                                     task.status === "DONE" ? "Completed" : "To Do"}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-md border border-amber-500/30 mb-4">
                        <p className="text-gray-300 whitespace-pre-line">{task.description || "No description provided"}</p>
                    </div>

                    <div className="space-y-3">
                        {task.dueDate && (
                            <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 text-amber-400 mr-2" />
                                <span className="text-gray-400">Due Date:</span>
                                <span className="ml-2 text-white">{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        {task.projectName && (
                            <div className="flex items-center text-sm">
                                <ClipboardList className="w-4 h-4 text-amber-400 mr-2" />
                                <span className="text-gray-400">Project:</span>
                                <span className="ml-2 text-white">{task.projectName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-amber-500/30 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}