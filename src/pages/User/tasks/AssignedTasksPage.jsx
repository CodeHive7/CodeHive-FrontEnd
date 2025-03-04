import { useState, useEffect } from "react";
import { fetchAssignedTasks, updateTaskStatus } from "../../../services/userService/UserService";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ClipboardList, CheckCircle, Loader, XCircle, Info, AlertTriangle } from "lucide-react";
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
                title: "✅ Task Updated!",
                text: `Task successfully moved to ${status}.`,
                timer: 2000,
                showConfirmButton: false,
            });
            loadTasks();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "❌ Update Failed",
                text: "Failed to update task status. Please try again.",
            });
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="max-w-5xl mx-auto bg-gradient-to-b from-[#0A0B14] to-[#12141F] p-8 rounded-xl shadow-lg border border-yellow-500 mt-10">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-yellow-400" /> Tasks Assigned to Me
                </h2>

                {loading ? (
                    <p className="text-gray-400 text-center text-lg mt-6">Loading tasks...</p>
                ) : (
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {Object.entries(tasks).map(([status, taskList]) => (
                            <TaskColumn key={status} status={status} tasks={taskList} onDropTask={handleStatusChange} setSelectedTask={setSelectedTask} />
                        ))}
                    </div>
                )}
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

    return (
        <div
            ref={drop}
            className={`p-4 rounded-lg shadow-md border border-gray-600 min-h-[300px] transition ${isOver ? "bg-gray-800" : "bg-[#222435]"} ${
                status === "TODO" ? "border-yellow-500" : status === "DOING" ? "border-blue-500" : "border-green-500"
            }`}
        >
            <h3 className={`text-xl font-bold text-white mb-4 flex items-center gap-2`}>
                {status === "TODO" ? <XCircle className="w-5 h-5 text-yellow-400" /> : status === "DOING" ? <Loader className="w-5 h-5 text-blue-400" /> : <CheckCircle className="w-5 h-5 text-green-400" />} {status}
            </h3>
            {tasks.length > 0 ? (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} setSelectedTask={setSelectedTask} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm">No tasks in this column.</p>
            )}
        </div>
    );
}

function TaskCard({ task, setSelectedTask }) {
    const [{ isDragging }, drag] = useDrag({
        type: TaskTypes.TASK,
        item: { id: task.id },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    return (
        <div
            ref={drag}
            onClick={() => setSelectedTask(task)}
            className={`p-4 rounded-md shadow-md border border-gray-700 cursor-pointer transition transform hover:scale-105 hover:shadow-lg ${isDragging ? "opacity-50" : "opacity-100"} ${
                task.priority === "HIGH" ? "bg-red-500" : task.priority === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
            } text-black font-semibold`}
        >
            <h4 className="text-lg flex items-center gap-2">
                {task.title} <Info className="w-4 h-4 text-black opacity-75" />
            </h4>
        </div>
    );
}

// Task Detail Modal
function TaskModal({ task, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-lg border border-gray-700 w-96 text-white relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-300">&times;</button>
                <h3 className="text-2xl font-bold mb-4">{task.title}</h3>
                <p className="text-gray-300">{task.description}</p>
                <div className="mt-4">
                    <p className="text-sm text-gray-400">Priority:
                        <span className={`ml-2 font-semibold ${task.priority === "HIGH" ? "text-red-500" : task.priority === "MEDIUM" ? "text-yellow-500" : "text-green-500"}`}>
                            {task.priority}
                        </span>
                    </p>
                    <p className="text-sm text-gray-400">Due Date: <span className="text-white">{task.dueDate}</span></p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
}
