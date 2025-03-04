import { useState, useEffect } from "react";
import { fetchMyProjects, createTask, fetchAcceptedApplicants } from "../../../services/userService/UserService";
import { Kanban, Users } from "lucide-react";
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
                loadAcceptedApplicants(data[0].id); // Load applicants for first project
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
        loadAcceptedApplicants(e.target.value); // Load applicants when project changes
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
                text: "Please fill in all required fields including selecting a project and assignee.",
            });
            return;
        }

        try {
            await createTask(selectedProject, taskDetails);
            Swal.fire({
                icon: "success",
                title: "Task Created",
                text: "Your task has been successfully created!",
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
                text: "Failed to create task. Please try again.",
            });
        }
    };

    return (
        <div className="p-6 bg-[#1C1F2E] rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-2">
                <Kanban className="w-6 h-6" /> Create Task
            </h2>

            {/* Select Project */}
            <div className="mb-4">
                <label className="text-gray-400">Select Project</label>
                <select
                    value={selectedProject}
                    onChange={handleProjectChange}
                    className="w-full p-2 mt-1 rounded-md bg-gray-900 text-white border border-gray-700"
                >
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>

            {/* Task Inputs */}
            <input
                name="title"
                placeholder="Task Title"
                onChange={handleInputChange}
                value={taskDetails.title}
                className="w-full p-3 mt-2 rounded-md bg-gray-900 text-white border border-gray-700"
            />
            <textarea
                name="description"
                placeholder="Task Description"
                onChange={handleInputChange}
                value={taskDetails.description}
                className="w-full p-3 mt-2 rounded-md bg-gray-900 text-white border border-gray-700"
            />

            <div className="flex gap-4 mt-3">
                <input
                    name="dueDate"
                    type="date"
                    placeholder="Due Date"
                    onChange={handleInputChange}
                    value={taskDetails.dueDate}
                    className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-700"
                />
                <select
                    name="priority"
                    value={taskDetails.priority}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-700"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
            </div>

            {/* Select Assigned User */}
            <div className="mt-4">
                <label className="text-gray-400 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Assign Task To
                </label>
                <select
                    name="assignedToUserId"
                    value={taskDetails.assignedToUserId}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 rounded-md bg-gray-900 text-white border border-gray-700"
                >
                    <option value="">Select User</option>
                    {applicants.map((applicant) => (
                        <option key={applicant.id} value={applicant.id}>
                            {applicant.username}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-semibold"
                onClick={handleCreateTask}
            >
                Create Task
            </button>
        </div>
    );
}
