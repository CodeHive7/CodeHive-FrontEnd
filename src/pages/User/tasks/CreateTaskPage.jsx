import { useState, useEffect } from "react";
import { fetchMyProjects, createTask, fetchAcceptedApplicants } from "../../../services/userService/UserService";
import { Kanban, Users, CheckCircle, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export default function CreateTaskPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [applicants, setApplicants] = useState([]);
    const [taskDetails, setTaskDetails] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        assignedToUserId: "",
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchMyProjects();
            setProjects(data);
            if (data.length > 0) {
                setSelectedProject(data[0].id);
                loadAcceptedApplicants(data[0].id);
            }
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    const loadAcceptedApplicants = async (projectId) => {
        try {
            const data = await fetchAcceptedApplicants(projectId);
            setApplicants(data);
        } catch (error) {
            console.error("Error fetching accepted applicants", error);
        }
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
        loadAcceptedApplicants(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskDetails({ ...taskDetails, [name]: value });
    };

    const handleCreateTask = async () => {
        if (!selectedProject || !taskDetails.title || !taskDetails.assignedToUserId) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill in all required fields, including selecting a project and assignee.",
            });
            return;
        }

        try {
            await createTask(selectedProject, taskDetails);
            Swal.fire({
                icon: "success",
                title: "✅ Task Created!",
                text: "Your task has been successfully created.",
                timer: 2000,
                showConfirmButton: false,
            });
            setTaskDetails({
                title: "",
                description: "",
                priority: "MEDIUM",
                dueDate: "",
                assignedToUserId: "",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "❌ Failed to create task. Please try again.",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#0A0B14] to-[#12141F] p-8 rounded-xl shadow-lg border border-yellow-500 mt-10">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <Kanban className="w-6 h-6 text-yellow-400" /> Create Task
            </h2>

            {/* Select Project */}
            <div className="mt-6">
                <label className="text-gray-400 font-medium">Select Project</label>
                <select
                    value={selectedProject}
                    onChange={handleProjectChange}
                    className="w-full p-3 mt-1 rounded-md bg-gray-900 text-white border border-gray-700 hover:border-yellow-500 transition"
                >
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>

            {/* Task Inputs */}
            <div className="mt-4">
                <label className="text-gray-400 font-medium">Task Title</label>
                <input
                    name="title"
                    placeholder="Enter task title"
                    onChange={handleInputChange}
                    value={taskDetails.title}
                    className="w-full p-3 mt-1 rounded-md bg-gray-900 text-white border border-gray-700 hover:border-yellow-500 transition"
                />
            </div>

            <div className="mt-4">
                <label className="text-gray-400 font-medium">Task Description</label>
                <textarea
                    name="description"
                    placeholder="Describe the task"
                    onChange={handleInputChange}
                    value={taskDetails.description}
                    className="w-full p-3 mt-1 rounded-md bg-gray-900 text-white border border-gray-700 hover:border-yellow-500 transition"
                />
            </div>

            {/* Priority & Due Date */}
            <div className="flex gap-4 mt-4">
                <div className="w-full">
                    <label className="text-gray-400 font-medium">Due Date</label>
                    <input
                        name="dueDate"
                        type="date"
                        onChange={handleInputChange}
                        value={taskDetails.dueDate}
                        className="w-full p-3 mt-1 rounded-md bg-gray-900 text-white border border-gray-700 hover:border-yellow-500 transition"
                    />
                </div>

                <div className="w-full">
                    <label className="text-gray-400 font-medium">Priority</label>
                    <select
                        name="priority"
                        value={taskDetails.priority}
                        onChange={handleInputChange}
                        className="w-full p-3 mt-1 rounded-md bg-gray-900 text-white border border-gray-700 hover:border-yellow-500 transition"
                    >
                        <option value="LOW" className="text-green-400">🐢 Low</option>
                        <option value="MEDIUM" className="text-yellow-400">⚡ Medium</option>
                        <option value="HIGH" className="text-red-400">🔥 High</option>
                    </select>
                </div>
            </div>

            {/* Select Assigned User */}
            <div className="mt-4">
                <label className="text-gray-400 font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-yellow-400" /> Assign Task To
                </label>
                <select
                    name="assignedToUserId"
                    value={taskDetails.assignedToUserId}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 rounded-md bg-gray-900 text-white border border-gray-700 hover:border-yellow-500 transition"
                >
                    <option value="">Select User</option>
                    {applicants.map((applicant) => (
                        <option key={applicant.id} value={applicant.id}>
                            {applicant.username}
                        </option>
                    ))}
                </select>
            </div>

            {/* Create Task Button */}
            <button
                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-md text-lg transition flex items-center justify-center gap-2"
                onClick={handleCreateTask}
            >
                <CheckCircle className="w-5 h-5" /> Create Task
            </button>

            {/* Warning Message */}
            <div className="mt-4 text-sm text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Make sure to select the right project and assignee before submitting.
            </div>
        </div>
    );
}
