import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import {
    fetchAllProjects,
    applyForPosition,
    createProject,
    fetchCategories,
} from "../../services/userService/UserService.js";
import { 
    LayoutDashboard, 
    LogOut, 
    PlusCircle, 
    X, 
    ChevronRight, 
    Users, 
    Calendar, 
    MessageSquare,
    Code,
    Grid,
    Layers,
    GitBranch
} from "lucide-react";
import Swal from "sweetalert2";

export default function UserHomePage() {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        stage: "",
        websiteUrl: "",
        problemToFix: "",
        question1: "",
        question2: "",
        selectedCategory: "",
        positions: [{ roleName: "", paid: false, quantity: 1 }],
    });
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    const { logoutHandler } = useAuth();

    useEffect(() => {
        loadProjects();
        loadCategories();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchAllProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories", error);
        }
    };

    const handleApply = async (projectId, positionId) => {
        try {
            await applyForPosition(projectId, positionId);
            alert("Application submitted successfully!");
        } catch (error) {
            console.error("Error applying for position", error);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.name || !newProject.description || !newProject.selectedCategory) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill in all required fields before submitting.",
            });
            return;
        }
        try {
            await createProject(newProject);
            Swal.fire({
                icon: "success",
                title: "Project Created",
                text: "Your project has been created successfully!",
                timer: 2000,
                showConfirmButton: false,
            });
            setIsModalOpen(false);
            loadProjects();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Creating Project",
                text: error.response?.data || "An error occurred while creating the project. Please try again.",
            });
        }
    };

    const toggleDescription = (projectId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    // Get stage badge color
    const getStageBadgeColor = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return "bg-blue-600";
            case "IN_DEVELOPMENT": return "bg-amber-600";
            case "FINISHED": return "bg-green-600";
            case "NEEDS_FIXES": return "bg-red-600";
            default: return "bg-purple-600";
        }
    };

    // Get stage display name
    const getStageDisplayName = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return "Not Started";
            case "IN_DEVELOPMENT": return "In Development";
            case "FINISHED": return "Completed";
            case "NEEDS_FIXES": return "Needs Fixes";
            default: return stage || "Ongoing";
        }
    };

    // Get stage icon
    const getStageIcon = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return <Layers className="w-3 h-3 mr-1" />;
            case "IN_DEVELOPMENT": return <GitBranch className="w-3 h-3 mr-1" />;
            case "FINISHED": return <Code className="w-3 h-3 mr-1" />;
            case "NEEDS_FIXES": return <Grid className="w-3 h-3 mr-1" />;
            default: return <Code className="w-3 h-3 mr-1" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white overflow-x-hidden relative">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14]">
                <div className="flex h-16 items-center justify-between px-6">
                    <h1 className="text-3xl font-bold text-white">
                        <span className="text-yellow-400">Code</span>Hive
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-md flex items-center"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Create Project
                        </button>
                        {/* Chat Button */}
                        <Link to="/user/messages" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            <span className="hidden md:inline">Chat</span>
                        </Link>
                        <Link to="/user" className="hover:bg-gray-800 p-2 rounded-md">
                            <LayoutDashboard className="h-6 w-6 text-white" />
                        </Link>
                        <button onClick={logoutHandler} className="hover:bg-gray-800 p-2 rounded-md">
                            <LogOut className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Projects Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 overflow-hidden">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                    <span className="relative inline-block">
                        <span className="relative z-10">Explore Projects</span>
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-500 opacity-20 rounded"></span>
                    </span>
                </h2>

                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-gray-800 rounded-full mb-4">
                            <Code className="h-12 w-12 text-yellow-400" />
                        </div>
                        <p className="text-gray-400 text-xl">No projects available at the moment.</p>
                        <p className="text-gray-500 mt-2">Be the first to create one!</p>
                    </div>
                ) : (
                    <div className={`project-grid grid gap-6 sm:gap-8 mx-auto
                        ${projects.length === 1 ? 'grid-cols-1 w-4/5' : 
                          projects.length === 2 ? 'grid-cols-2' : 
                              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="project-card group bg-gradient-to-br from-[#12141F] to-[#191c2e] rounded-lg overflow-hidden shadow-lg border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:border-yellow-500/30"
                            >
                                {/* Hexagonal design elements - more subtle */}
                                <div className="absolute -left-12 -top-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl"></div>
                                <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl"></div>

                                {/* Stage badge */}
                                <div className={`absolute top-0 right-0 ${getStageBadgeColor(project.stage)} px-3 py-1 text-white text-xs font-bold rounded-bl-lg flex items-center`}>
                                    {getStageIcon(project.stage)}
                                    {getStageDisplayName(project.stage)}
                                </div>

                                <div className="p-6">
                                    {/* Header */}
                                    <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                                        {project.name}
                                    </h3>

                                    {/* Category */}
                                    <p className="text-gray-400 text-sm mt-1">
                                        <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                                            {project.category || "Uncategorized"}
                                        </span>
                                    </p>

                                    {/* Description */}
                                    <div className="mt-3 text-gray-300">
                                        {project.description && (
                                            <p className="relative">
                                                {project.description.length > 120 && !expandedDescriptions[project.id]
                                                    ? project.description.substring(0, 120) + "..."
                                                    : project.description}

                                                {project.description.length > 120 && (
                                                    <button
                                                        onClick={() => toggleDescription(project.id)}
                                                        className="text-yellow-400 hover:underline ml-1 text-sm"
                                                    >
                                                        {expandedDescriptions[project.id] ? "Show less" : "Read more"}
                                                    </button>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    {/* Project info */}
                                    <div className="flex justify-between items-center mt-4 text-sm">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span>{project.positions.reduce((sum, pos) => sum + (parseInt(pos.quantity) || 0), 0)} positions</span>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>Created recently</span>
                                        </div>
                                    </div>

                                    {/* Positions - updated styling */}
                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                                            <span className="mr-2">Open Roles</span>
                                            <div className="h-px bg-yellow-500/30 flex-grow"></div>
                                        </h4>

                                        {project.positions.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto">
                                                {project.positions.map((position, index) => (
                                                <div
                                                    key={index}
                                                    className="inline-flex items-center bg-gray-800/70 border border-gray-700 px-2 py-1 rounded text-xs sm:text-sm transition-all hover:bg-gray-700/70 hover:border-yellow-500/50 group mb-1"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                                                    <span className="truncate max-w-[80px] sm:max-w-[120px]">{position.roleName}</span>
                                                    <div className="flex items-center ml-1 px-1 py-0.5 bg-gray-900/50 rounded">
                                                        <span className="text-gray-300 text-xs">
                                                            {position.quantity} spots
                                                        </span>
                                                    </div>
                                                        {position.paid && (
                                                            <span className="ml-1 bg-green-900/60 text-green-300 text-xs px-1 py-0.5 rounded">
                                                                $
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm">No open positions</p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="mt-5 w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-md text-base font-semibold transition-all group-hover:shadow-lg"
                                    >
                                        View Details
                                        <ChevronRight className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Subtle hexagonal background pattern */}
                <div className="hidden lg:block absolute right-0 top-1/3 opacity-5 pointer-events-none">
                    <div className="w-48 h-48 border border-yellow-500/30 rotate-12 rounded-lg"></div>
                </div>
                <div className="hidden lg:block absolute left-0 bottom-1/4 opacity-5 pointer-events-none">
                    <div className="w-36 h-36 border border-yellow-500/30 -rotate-12 rounded-lg"></div>
                </div>
            </div>

            {/* Create Project Modal - updated colors */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative bg-[#1C1F2E] w-full max-w-4xl h-[80vh] overflow-y-auto rounded-lg shadow-lg border border-yellow-500/50 p-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">
                            <span className="text-yellow-400">Create</span> New Project
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                            />
                            <textarea
                                placeholder="Describe your project..."
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded h-24 focus:border-yellow-500 focus:outline-none"
                            />
                            <select
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                                value={newProject.stage}
                                onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                            >
                                <option value="">Select Stage</option>
                                <option value="NOT_STARTED">Not Started</option>
                                <option value="IN_DEVELOPMENT">In Development</option>
                                <option value="FINISHED">Finished</option>
                                <option value="NEEDS_FIXES">Needs Fixes</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Website URL (optional)"
                                value={newProject.websiteUrl}
                                onChange={(e) => setNewProject({ ...newProject, websiteUrl: e.target.value })}
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                            />
                            <textarea
                                placeholder="What problem does this project solve?"
                                value={newProject.problemToFix}
                                onChange={(e) => setNewProject({ ...newProject, problemToFix: e.target.value })}
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded h-24 focus:border-yellow-500 focus:outline-none"
                            />
                            <h3 className="text-white font-semibold text-lg mb-3">Optional Questions for Applicants</h3>
                            <input
                                type="text"
                                placeholder="Question 1 for applicants (Optional)"
                                value={newProject.question1}
                                onChange={(e) => setNewProject({ ...newProject, question1: e.target.value })}
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                            />
                            {newProject.question1 && (
                                <input
                                    type="text"
                                    placeholder="Question 2 for applicants (Optional)"
                                    value={newProject.question2}
                                    onChange={(e) => setNewProject({ ...newProject, question2: e.target.value })}
                                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                                />
                            )}
                            <select
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                                value={newProject.selectedCategory}
                                onChange={(e) => setNewProject({ ...newProject, selectedCategory: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <h3 className="text-white font-semibold text-lg mb-3">Project Positions</h3>
                            {newProject.positions.map((position, index) => (
                                <div key={index} className="bg-gray-900 p-4 rounded-md mb-3 border border-gray-800">
                                    <input
                                        type="text"
                                        placeholder="Role Name"
                                        value={position.roleName}
                                        onChange={(e) => {
                                            const updatedPositions = [...newProject.positions];
                                            updatedPositions[index].roleName = e.target.value;
                                            setNewProject({ ...newProject, positions: updatedPositions });
                                        }}
                                        className="w-full p-2 mb-2 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                                    />
                                    <label className="flex items-center text-white text-sm">
                                        <input
                                            type="checkbox"
                                            checked={position.paid}
                                            onChange={(e) => {
                                                const updatedPositions = [...newProject.positions];
                                                updatedPositions[index].paid = e.target.checked;
                                                setNewProject({ ...newProject, positions: updatedPositions });
                                            }}
                                            className="mr-2 accent-yellow-500"
                                        />
                                        Paid Position
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={position.quantity}
                                        onChange={(e) => {
                                            const updatedPositions = [...newProject.positions];
                                            updatedPositions[index].quantity = e.target.value;
                                            setNewProject({ ...newProject, positions: updatedPositions });
                                        }}
                                        className="w-full p-2 mt-2 border border-gray-700 bg-gray-800 text-white rounded focus:border-yellow-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            const updatedPositions = newProject.positions.filter((_, i) => i !== index);
                                            setNewProject({ ...newProject, positions: updatedPositions });
                                        }}
                                        className="text-red-400 mt-2 hover:text-red-300 text-sm"
                                    >
                                        Remove Position
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() =>
                                    setNewProject({
                                        ...newProject,
                                        positions: [...newProject.positions, { roleName: "", paid: false, quantity: 1 }],
                                    })
                                }
                                className="text-yellow-400 hover:text-yellow-300 mt-2 text-sm"
                            >
                                + Add Position
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded text-lg w-full transition transform hover:scale-105"
                                onClick={handleCreateProject}
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}