import { useState, useEffect } from "react";
import { fetchMyProjects, createTask, fetchAcceptedApplicants } from "../../../services/userService/UserService";
import { Kanban, Users, CheckCircle, AlertTriangle, Loader2, Calendar, Flag } from "lucide-react";
import Swal from "sweetalert2";

export default function CreateTaskPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            const data = await fetchMyProjects();
            setProjects(data);
            if (data.length > 0) {
                setSelectedProject(data[0].id);
                await loadAcceptedApplicants(data[0].id);
            }
        } catch (error) {
            console.error("Error fetching projects", error);
        } finally {
            setLoading(false);
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
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308"
            });
            return;
        }

        try {
            await createTask(selectedProject, taskDetails);
            Swal.fire({
                icon: "success",
                title: "Task Created!",
                text: "Your task has been successfully created.",
                timer: 2000,
                showConfirmButton: false,
                background: "#1C1F2E",
                color: "#ffffff"
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
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 Create Task</h2>

            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 border-b border-yellow-500/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500/20 p-2 rounded-lg">
                            <Kanban className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">New Task</h3>
                            <p className="text-gray-400 text-sm">Create a task and assign it to a team member</p>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-yellow-500/20 rounded-lg">
                            <div className="bg-yellow-500/10 p-4 rounded-full mb-3">
                                <AlertTriangle className="w-10 h-10 text-yellow-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg">No projects available</p>
                            <p className="text-gray-500 text-sm mt-1">You need to create a project first</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Select Project */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Select Project</label>
                                <select
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    className="w-full p-3 rounded-md bg-[#181A28] text-white border border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                >
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Task Title */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Task Title</label>
                                <input
                                    name="title"
                                    placeholder="Enter task title"
                                    onChange={handleInputChange}
                                    value={taskDetails.title}
                                    className="w-full p-3 rounded-md bg-[#181A28] text-white border border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                />
                            </div>

                            {/* Task Description */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Task Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe the task"
                                    rows="4"
                                    onChange={handleInputChange}
                                    value={taskDetails.description}
                                    className="w-full p-3 rounded-md bg-[#181A28] text-white border border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                />
                            </div>

                            {/* Priority & Due Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center text-gray-400 text-sm mb-2">
                                        <Calendar className="w-4 h-4 mr-1 text-yellow-400" /> Due Date
                                    </label>
                                    <input
                                        name="dueDate"
                                        type="date"
                                        onChange={handleInputChange}
                                        value={taskDetails.dueDate}
                                        className="w-full p-3 rounded-md bg-[#181A28] text-white border border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-gray-400 text-sm mb-2">
                                        <Flag className="w-4 h-4 mr-1 text-yellow-400" /> Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={taskDetails.priority}
                                        onChange={handleInputChange}
                                        className="w-full p-3 rounded-md bg-[#181A28] text-white border border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    >
                                        <option value="LOW">🐢 Low Priority</option>
                                        <option value="MEDIUM">⚡ Medium Priority</option>
                                        <option value="HIGH">🔥 High Priority</option>
                                    </select>
                                </div>
                            </div>

                            {/* Select Assigned User */}
                            <div>
                                <label className="flex items-center text-gray-400 text-sm mb-2">
                                    <Users className="w-4 h-4 mr-1 text-yellow-400" /> Assign Task To
                                </label>
                                {applicants.length === 0 ? (
                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-yellow-400 text-sm">
                                        This project has no accepted applicants yet. Accept team members to assign tasks.
                                    </div>
                                ) : (
                                    <select
                                        name="assignedToUserId"
                                        value={taskDetails.assignedToUserId}
                                        onChange={handleInputChange}
                                        className="w-full p-3 rounded-md bg-[#181A28] text-white border border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                                    >
                                        <option value="">Select Team Member</option>
                                        {applicants.map((applicant) => (
                                            <option key={applicant.id} value={applicant.id}>
                                                {applicant.username}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Create Task Button */}
                            <button
                                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                                onClick={handleCreateTask}
                                disabled={applicants.length === 0}
                            >
                                <CheckCircle className="w-5 h-5" /> Create Task
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23EAB308' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                    backgroundSize: "112px 200px"
                }}>
            </div>
        </div>
    );
}