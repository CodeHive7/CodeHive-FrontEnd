import { useState, useEffect } from "react";
import { fetchMyProjects, createTask, fetchAcceptedApplicants } from "../../../services/userService/UserService";
import { Kanban, Users, CheckCircle, AlertTriangle, Loader2, Calendar, Flag, Terminal, Code } from "lucide-react";
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
                title: "Missing Information",
                text: "Please fill in the required fields: project, title and team member.",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
            });
            return;
        }

        try {
            await createTask(selectedProject, taskDetails);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Task created successfully",
                timer: 2000,
                showConfirmButton: false,
                background: "#111827",
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
                text: "Failed to create task. Please try again later.",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
                    <Loader2 className="w-16 h-16 text-amber-500 animate-spin relative z-10" />
                </div>
                <p className="text-gray-400 text-lg">Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                <span className="text-amber-500">Create </span>
                <span className="text-amber-400">New Task</span>
            </h2>

            <div className="bg-gray-900 border-2 border-amber-500/30 rounded-lg shadow-xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-amber-500/20 to-transparent p-6 md:p-8 border-b-2 border-amber-500/40">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500/20 p-3 rounded-lg">
                            <Terminal className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-white">New Task</h3>
                            <p className="text-gray-400 text-base mt-1">Create and assign to a team member</p>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 md:p-8">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-amber-500/30 rounded-lg bg-gray-900/50">
                            <div className="bg-amber-500/20 p-6 rounded-full mb-5">
                                <AlertTriangle className="w-14 h-14 text-amber-500" />
                            </div>
                            <p className="text-gray-300 text-xl">No projects available</p>
                            <p className="text-gray-500 text-base mt-3">You need to create a project first</p>
                        </div>
                    ) : (
                        <div className="space-y-7">
                            {/* Select Project */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-3 px-2 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-sm">Select Project</label>
                                </div>
                                <select
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    className="w-full p-4 text-base rounded-md bg-gray-950 text-white border-2 border-amber-500/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                >
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Task Title */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-3 px-2 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-sm">Task Title</label>
                                </div>
                                <input
                                    name="title"
                                    placeholder="Enter task title..."
                                    onChange={handleInputChange}
                                    value={taskDetails.title}
                                    className="w-full p-4 text-base rounded-md bg-gray-950 text-white border-2 border-amber-500/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                            </div>

                            {/* Task Description */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-3 px-2 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-sm">Description</label>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 px-4 py-4 text-gray-500 text-lg">/**</div>
                                    <textarea
                                        name="description"
                                        placeholder="Task description goes here..."
                                        rows="5"
                                        onChange={handleInputChange}
                                        value={taskDetails.description}
                                        className="w-full p-4 pl-12 text-base rounded-md bg-gray-950 text-white border-2 border-amber-500/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    />
                                    <div className="absolute bottom-0 left-0 px-4 py-4 text-gray-500 text-lg">*/</div>
                                </div>
                            </div>

                            {/* Priority & Due Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <div className="absolute top-0 left-0 ml-4 -mt-3 px-2 bg-gray-900 z-10">
                                        <label className="text-amber-400 text-sm">Due Date</label>
                                    </div>
                                    <div className="relative">
                                        <Calendar 
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500/70 w-5 h-5 z-10 pointer-events-none" 
                                        />
                                        <input
                                            name="dueDate"
                                            type="date"
                                            onChange={handleInputChange}
                                            value={taskDetails.dueDate}
                                            className="w-full p-4 pl-12 text-base rounded-md bg-gray-950 text-white border-2 border-amber-500/40 
                                                     focus:border-amber-500 focus:ring-1 focus:ring-amber-500
                                                     [color-scheme:dark] appearance-none"
                                            onClick={(e) => {
                                                // Ensure focus and open the date picker
                                                e.target.showPicker && e.target.showPicker();
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute top-0 left-0 ml-4 -mt-3 px-2 bg-gray-900 z-10">
                                        <label className="text-amber-400 text-sm">Priority</label>
                                    </div>
                                    <div className="relative">
                                        <Flag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500/70 w-5 h-5" />
                                        <select
                                            name="priority"
                                            value={taskDetails.priority}
                                            onChange={handleInputChange}
                                            className="w-full p-4 pl-12 text-base rounded-md bg-gray-950 text-white border-2 border-amber-500/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none"
                                        >
                                            <option value="LOW">Low Priority 🐢</option>
                                            <option value="MEDIUM">Medium Priority ⚡</option>
                                            <option value="HIGH">High Priority 🔥</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Select Assigned User */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-3 px-2 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-sm">Assign To</label>
                                </div>
                                {applicants.length === 0 ? (
                                    <div className="p-6 bg-gray-950 border-2 border-amber-500/30 rounded-md">
                                        <div className="flex items-start">
                                            <Code className="w-5 h-5 text-amber-400 mr-3 mt-0.5" />
                                            <p className="text-amber-400 text-base">
                                                No team members found
                                            </p>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-3 ml-8">
                                            You need to accept team members before you can assign tasks
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500/70 w-5 h-5" />
                                        <select
                                            name="assignedToUserId"
                                            value={taskDetails.assignedToUserId}
                                            onChange={handleInputChange}
                                            className="w-full p-4 pl-12 text-base rounded-md bg-gray-950 text-white border-2 border-amber-500/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none"
                                        >
                                            <option value="">Select team member</option>
                                            {applicants.map((applicant) => (
                                                <option key={applicant.id} value={applicant.id}>
                                                    {applicant.username}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Create Task Button */}
                            <div className="relative py-8 mt-8 text-center">
                                <div className="absolute left-0 top-1/2 h-px bg-amber-500/30 w-1/3 transform -translate-y-1/2"></div>
                                <div className="absolute right-0 top-1/2 h-px bg-amber-500/30 w-1/3 transform -translate-y-1/2"></div>
                                <button
                                    className={`px-10 py-4 text-lg rounded-lg transition-all transform active:scale-95
                                        ${applicants.length === 0 
                                            ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                                            : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg hover:shadow-amber-500/30"}`}
                                    onClick={handleCreateTask}
                                    disabled={applicants.length === 0}
                                >
                                    Create Task
                                </button>
                                {applicants.length === 0 && (
                                    <p className="mt-3 text-gray-500 text-sm">You need team members before creating tasks</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                    backgroundSize: "112px 200px"
                }}>
            </div>
        </div>
    );
}