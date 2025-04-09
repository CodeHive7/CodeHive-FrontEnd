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
                title: "ValidationError",
                text: "Error: Required fields cannot be null. Check project, title and assignee.",
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
                title: "task.create()",
                text: "return { status: 201, message: 'Task created successfully' }",
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
                title: "TaskCreationException",
                text: "Error: API request failed with status 500. Retry operation.",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-md bg-amber-500/20 animate-ping"></div>
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin relative z-10" />
                </div>
                <p className="text-gray-400 font-mono animate-pulse">projects.loading();</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">Task</span>
                <span className="text-white">::</span>
                <span className="text-amber-400">create()</span>
            </h2>

            <div className="bg-gray-900 border border-amber-500/30 rounded-md shadow-md overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-6 border-b border-amber-500/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-md">
                            <Terminal className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white font-mono">new Task();</h3>
                            <p className="text-gray-400 text-sm font-mono">// initialize and assign to team member</p>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-amber-500/20 rounded-md">
                            <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                <AlertTriangle className="w-10 h-10 text-amber-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg font-mono">projects.length === 0</p>
                            <p className="text-gray-500 text-sm mt-1 font-mono">// first create a Project instance</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Select Project */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-2 px-1 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-xs font-mono">project.select(id)</label>
                                </div>
                                <select
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    className="w-full p-3 rounded-md bg-gray-950 text-white border border-amber-500/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                >
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Task Title */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-2 px-1 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-xs font-mono">.title</label>
                                </div>
                                <input
                                    name="title"
                                    placeholder="task.title = '...'"
                                    onChange={handleInputChange}
                                    value={taskDetails.title}
                                    className="w-full p-3 rounded-md bg-gray-950 text-white border border-amber-500/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                />
                            </div>

                            {/* Task Description */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-2 px-1 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-xs font-mono">.description</label>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-0 left-0 px-3 py-3 text-gray-500 font-mono">/**</div>
                                    <textarea
                                        name="description"
                                        placeholder="Task description goes here..."
                                        rows="4"
                                        onChange={handleInputChange}
                                        value={taskDetails.description}
                                        className="w-full p-3 pl-10 rounded-md bg-gray-950 text-white border border-amber-500/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                    />
                                    <div className="absolute bottom-0 left-0 px-3 py-3 text-gray-500 font-mono">*/</div>
                                </div>
                            </div>

                            {/* Priority & Due Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <div className="absolute top-0 left-0 ml-4 -mt-2 px-1 bg-gray-900 z-10">
                                        <label className="text-amber-400 text-xs font-mono">.dueDate</label>
                                    </div>
                                    <input
                                        name="dueDate"
                                        type="date"
                                        onChange={handleInputChange}
                                        value={taskDetails.dueDate}
                                        className="w-full p-3 rounded-md bg-gray-950 text-white border border-amber-500/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute top-0 left-0 ml-4 -mt-2 px-1 bg-gray-900 z-10">
                                        <label className="text-amber-400 text-xs font-mono">.priority</label>
                                    </div>
                                    <select
                                        name="priority"
                                        value={taskDetails.priority}
                                        onChange={handleInputChange}
                                        className="w-full p-3 rounded-md bg-gray-950 text-white border border-amber-500/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                    >
                                        <option value="LOW">Priority.LOW 🐢</option>
                                        <option value="MEDIUM">Priority.MEDIUM ⚡</option>
                                        <option value="HIGH">Priority.HIGH 🔥</option>
                                    </select>
                                </div>
                            </div>

                            {/* Select Assigned User */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 ml-4 -mt-2 px-1 bg-gray-900 z-10">
                                    <label className="text-amber-400 text-xs font-mono">.assignTo(userId)</label>
                                </div>
                                {applicants.length === 0 ? (
                                    <div className="p-4 bg-gray-950 border border-amber-500/30 rounded-md">
                                        <div className="flex items-start">
                                            <Code className="w-4 h-4 text-amber-400 mr-2 mt-0.5" />
                                            <pre className="text-amber-400 text-sm font-mono">
                                                <span className="text-blue-400">throw</span> <span className="text-red-400">new</span> <span className="text-green-400">TeamError</span>("No accepted applicants found");
                                            </pre>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-2 ml-6 font-mono">
                                            // Accept team members before assigning tasks
                                        </p>
                                    </div>
                                ) : (
                                    <select
                                        name="assignedToUserId"
                                        value={taskDetails.assignedToUserId}
                                        onChange={handleInputChange}
                                        className="w-full p-3 rounded-md bg-gray-950 text-white border border-amber-500/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                    >
                                        <option value="">selectTeamMember()</option>
                                        {applicants.map((applicant) => (
                                            <option key={applicant.id} value={applicant.id}>
                                                user::{applicant.username}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Create Task Button */}
                            <div className="relative py-6 mt-6 text-center">
                                <div className="absolute left-0 top-1/2 h-px bg-amber-500/20 w-1/3 transform -translate-y-1/2"></div>
                                <div className="absolute right-0 top-1/2 h-px bg-amber-500/20 w-1/3 transform -translate-y-1/2"></div>
                                <button
                                    className={`px-8 py-3 rounded-md transition-all transform hover:scale-105 font-mono
                                        ${applicants.length === 0 
                                            ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                                            : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg hover:shadow-amber-500/25"}`}
                                    onClick={handleCreateTask}
                                    disabled={applicants.length === 0}
                                >
                                    task.save()
                                </button>
                                {applicants.length === 0 && (
                                    <p className="mt-2 text-gray-500 text-xs font-mono">// Method disabled: no team members available</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Code-style decorative element */}
            <div className="fixed top-10 right-10 opacity-10 pointer-events-none">
                <pre className="text-amber-500 text-xs font-mono">
                    {`function Task(title, assignee) {
  this.status = "TODO";
  this.created = new Date();
  this.notify = () => {
    sendAlert(assignee);
  };
  // ... 
}`}
                </pre>
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