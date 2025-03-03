import { useState, useEffect } from "react";
import { fetchAssignedTasks, updateTaskStatus } from "../../../services/userService/UserService";
import { ClipboardList, CheckCircle, Loader, XCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function AssignedTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await fetchAssignedTasks();
            setTasks(data);
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
                text: `Task status updated to ${status}.`,
            });
            loadTasks();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Failed to update task status. Please try again.",
            });
        }
    };

    if (loading) {
        return <p className="text-gray-400 text-center text-lg">Loading tasks...</p>;
    }

    return (
        <div className="p-6 bg-[#1C1F2E] rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-2">
                <ClipboardList className="w-6 h-6" /> Tasks Assigned to Me
            </h2>
            {tasks.length > 0 ? (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="p-4 bg-[#222435] rounded-md shadow-md border border-gray-600">
                            <h3 className="text-xl text-white">{task.title}</h3>
                            <p className="text-gray-400 text-sm">{task.description}</p>
                            <p className={`text-sm mt-2 ${task.priority === "HIGH" ? "text-red-500" : task.priority === "MEDIUM" ? "text-yellow-500" : "text-green-500"}`}>
                                Priority: {task.priority}
                            </p>
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={() => handleStatusChange(task.id, "DOING")}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
                                >
                                    <Loader className="w-4 h-4" /> Doing
                                </button>
                                <button
                                    onClick={() => handleStatusChange(task.id, "DONE")}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
                                >
                                    <CheckCircle className="w-4 h-4" /> Done
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-lg">No tasks assigned to you.</p>
            )}
        </div>
    );
}
