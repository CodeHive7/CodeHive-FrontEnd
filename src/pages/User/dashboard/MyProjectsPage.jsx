import { useState, useEffect } from "react";
import { 
    FolderKanban, 
    CheckCircle, 
    XCircle, 
    Clock, 
    PlusCircle, 
    ArrowRight, 
    Loader2, 
    X, 
    ChevronRight,
    GitBranch,
    Code,
    Grid,
    Layers,
    Users 
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMyProjects, createProject, fetchCategories } from "../../../services/userService/UserService.js";
import Swal from "sweetalert2";

export default function MyProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
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

    useEffect(() => {
        loadProjects();
        loadCategories();
    }, []);

    // If modal is open, prevent body scrolling
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await fetchMyProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch your projects",
                background: "#111827",
                color: "#FFFFFF",
                confirmButtonColor: "#F59E0B",
            });
        } finally {
            setLoading(false);
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

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            return !!newProject.name && !!newProject.description && !!newProject.selectedCategory;
        } else if (currentStep === 2) {
            return !!newProject.stage;
        }
        return true;
    };

    const handleNextStep = () => {
        if (!validateCurrentStep()) {
            Swal.fire({
                icon: "warning",
                title: "Required Fields",
                text: "Please fill in all required fields",
                background: "#111827",
                color: "#FFFFFF",
                confirmButtonColor: "#F59E0B",
            });
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleCreateProject = async () => {
        if (!validateCurrentStep()) {
            Swal.fire({
                icon: "warning",
                title: "Required Fields",
                text: "Please fill in all required fields",
                background: "#111827",
                color: "#FFFFFF",
                confirmButtonColor: "#F59E0B",
            });
            return;
        }
        if (!newProject.positions.length || !newProject.positions[0].roleName) {
            Swal.fire({
                icon: "warning",
                title: "Missing Positions",
                text: "Please add at least one position",
                background: "#111827",
                color: "#FFFFFF",
                confirmButtonColor: "#F59E0B",
            });
            return;
        }
        try {
            Swal.fire({
                title: "Creating Project",
                text: "Please wait...",
                allowOutsideClick: false,
                background: "#111827",
                color: "#FFFFFF",
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            await createProject(newProject);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Project created successfully",
                timer: 2000,
                background: "#111827",
                color: "#FFFFFF",
                showConfirmButton: false,
            });
            setIsModalOpen(false);
            setNewProject({
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
            setCurrentStep(1);
            loadProjects();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to create project",
                background: "#111827",
                color: "#FFFFFF",
                confirmButtonColor: "#F59E0B",
            });
        }
    };

    // Utility functions for stage display
    const getStageBadgeColor = (stage) => {
        switch (stage) {
            case "NOT_STARTED":
                return "bg-blue-600";
            case "IN_DEVELOPMENT":
                return "bg-amber-600";
            case "FINISHED":
                return "bg-green-600";
            case "NEEDS_FIXES":
                return "bg-red-600";
            default:
                return "bg-purple-600";
        }
    };

    const getStageDisplayName = (stage) => {
        switch (stage) {
            case "NOT_STARTED":
                return "Not Started";
            case "IN_DEVELOPMENT":
                return "In Development";
            case "FINISHED":
                return "Completed";
            case "NEEDS_FIXES":
                return "Needs Fixes";
            default:
                return stage || "Ongoing";
        }
    };

    const getStageIcon = (stage) => {
        switch (stage) {
            case "NOT_STARTED":
                return <Layers className="w-3 h-3 mr-1" />;
            case "IN_DEVELOPMENT":
                return <GitBranch className="w-3 h-3 mr-1" />;
            case "FINISHED":
                return <Code className="w-3 h-3 mr-1" />;
            case "NEEDS_FIXES":
                return <Grid className="w-3 h-3 mr-1" />;
            default:
                return <Code className="w-3 h-3 mr-1" />;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-white">
                            <span className="bg-amber-500/10 px-3 py-1 rounded">
                                Basic Information
                            </span>
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter project name"
                                    value={newProject.name}
                                    onChange={(e) =>
                                        setNewProject({ ...newProject, name: e.target.value })
                                    }
                                    className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    placeholder="Describe your project"
                                    value={newProject.description}
                                    onChange={(e) =>
                                        setNewProject({ ...newProject, description: e.target.value })
                                    }
                                    className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md h-24 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                    required
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Provide clear details to attract the right developers
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Category *
                                </label>
                                <select
                                    className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                    value={newProject.selectedCategory}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            selectedCategory: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Website URL <span className="text-gray-500">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={newProject.websiteUrl}
                                    onChange={(e) =>
                                        setNewProject({ ...newProject, websiteUrl: e.target.value })
                                    }
                                    className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-white">
                            <span className="bg-amber-500/10 px-3 py-1 rounded">
                                Project Details
                            </span>
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Project Stage *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["NOT_STARTED", "IN_DEVELOPMENT", "NEEDS_FIXES", "FINISHED"].map(
                                        (stage) => (
                                            <div
                                                key={stage}
                                                onClick={() => setNewProject({ ...newProject, stage })}
                                                className={`p-2.5 border rounded-md cursor-pointer transition-all flex flex-col items-center ${
                                                    newProject.stage === stage
                                                        ? "border-amber-500 bg-amber-500/10"
                                                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                                                }`}
                                            >
                                                <div className="mb-1">{getStageIcon(stage)}</div>
                                                <span className="text-xs font-medium">
                                                    {getStageDisplayName(stage)}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Problem to Solve <span className="text-gray-500">(optional)</span>
                                </label>
                                <textarea
                                    placeholder="What problem does this project solve?"
                                    value={newProject.problemToFix}
                                    onChange={(e) =>
                                        setNewProject({ ...newProject, problemToFix: e.target.value })
                                    }
                                    className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md h-20 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Describing the problem helps contributors understand the purpose
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Application Questions <span className="text-gray-500">(optional)</span>
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Question 1"
                                        value={newProject.question1}
                                        onChange={(e) =>
                                            setNewProject({ ...newProject, question1: e.target.value })
                                        }
                                        className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                {newProject.question1 && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Question 2"
                                            value={newProject.question2}
                                            onChange={(e) =>
                                                setNewProject({ ...newProject, question2: e.target.value })
                                            }
                                            className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                )}
                                <p className="text-gray-400 text-xs">
                                    These questions will be shown to developers applying to your project
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-white">
                            <span className="bg-amber-500/10 px-3 py-1 rounded">
                                Team Positions
                            </span>
                        </h3>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-300">
                                Define required positions for your project
                            </p>
                            
                            <div className="max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                {newProject.positions.map((position, index) => (
                                    <div key={index} className="bg-gray-800/70 p-3 rounded-md border border-gray-700 mb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-white font-medium text-sm">Position {index + 1}</h4>
                                            {newProject.positions.length > 1 && (
                                                <button
                                                    onClick={() => {
                                                        const updatedPositions = newProject.positions.filter((_, i) => i !== index);
                                                        setNewProject({ ...newProject, positions: updatedPositions });
                                                    }}
                                                    className="text-red-400 hover:text-red-300 transition-colors text-xs flex items-center"
                                                >
                                                    <X className="w-3.5 h-3.5 mr-1" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                                    Role Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Frontend Developer"
                                                    value={position.roleName}
                                                    onChange={(e) => {
                                                        const updatedPositions = [...newProject.positions];
                                                        updatedPositions[index].roleName = e.target.value;
                                                        setNewProject({ ...newProject, positions: updatedPositions });
                                                    }}
                                                    className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors text-sm"
                                                />
                                            </div>
                                            
                                            <div className="flex justify-between gap-2">
                                                <div className="w-1/2">
                                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                                        Quantity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={position.quantity}
                                                        onChange={(e) => {
                                                            const updatedPositions = [...newProject.positions];
                                                            updatedPositions[index].quantity = parseInt(e.target.value) || 1;
                                                            setNewProject({ ...newProject, positions: updatedPositions });
                                                        }}
                                                        className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="w-1/2 flex items-end">
                                                    <label className="flex items-center p-2 border border-gray-700 bg-gray-900 rounded-md w-full cursor-pointer hover:bg-gray-800 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={position.paid}
                                                            onChange={(e) => {
                                                                const updatedPositions = [...newProject.positions];
                                                                updatedPositions[index].paid = e.target.checked;
                                                                setNewProject({ ...newProject, positions: updatedPositions });
                                                            }}
                                                            className="mr-2 text-amber-500 focus:ring-amber-500 rounded"
                                                        />
                                                        <span className="text-gray-300 text-xs">Paid Position</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={() => setNewProject({
                                    ...newProject,
                                    positions: [...newProject.positions, { roleName: "", paid: false, quantity: 1 }]
                                })}
                                className="w-full p-2 border border-dashed border-amber-500/50 bg-amber-500/5 rounded-md text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all flex items-center justify-center text-sm"
                            >
                                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                                Add Position
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    My Projects
                </h2>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setCurrentStep(1);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-md transition-colors flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                    <PlusCircle className="w-5 h-5" /> New Project
                </button>
            </div>

            {/* My Projects Panel */}
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
                <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">Projects I've created</h3>
                    <FolderKanban className="h-5 w-5 text-amber-400" />
                </div>

                <div className="p-4 sm:p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                            <p className="text-gray-400">Loading projects</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-lg">
                            <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                <PlusCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500/70" />
                            </div>
                            <p className="text-gray-400 text-base sm:text-lg">No projects yet</p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center px-4">Share your ideas with the community</p>
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setCurrentStep(1);
                                }}
                                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md transition-colors flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" /> Create a Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-gray-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-800 hover:border-amber-500/30 transition-all hover:shadow-lg relative group"
                                >
                                    {/* Stage Badge */}
                                    <div className={`absolute top-0 right-0 ${getStageBadgeColor(project.stage)} px-2 py-1 text-white text-xs font-bold rounded-bl-lg flex items-center`}>
                                        {getStageIcon(project.stage)}
                                        {getStageDisplayName(project.stage)}
                                    </div>
                                    
                                    {/* Project Header */}
                                    <div className="border-b border-gray-800 pb-3 mb-3">
                                        <h3 className="text-lg sm:text-xl font-bold text-white pr-16 sm:pr-20">{project.name}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                                                ID: {project.id}
                                            </span>
                                            {project.category && (
                                                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                                                    {project.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                                        {project.description}
                                    </p>

                                    {/* Team Info */}
                                    {project.positions && project.positions.length > 0 && (
                                        <div className="mb-3">
                                            <h4 className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center">
                                                <Users className="w-3 h-3 mr-1" />
                                                Positions
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.positions.map((position, index) => (
                                                    <div key={index} className="text-xs bg-gray-800 px-2 py-0.5 rounded-md flex items-center">
                                                        <span>{position.roleName}</span>
                                                        {position.paid && (
                                                            <span className="ml-1 text-green-400">$</span>
                                                        )}
                                                        <span className="ml-1 text-gray-400">({position.quantity})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Project Status */}
                                    <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-3">
                                        <div className="text-sm">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="font-medium ml-1">
                                                {project.status === "ACCEPTED" && (
                                                    <span className="text-green-500 flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                                                    </span>
                                                )}
                                                {project.status === "PENDING" && (
                                                    <span className="text-amber-500 flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" /> Pending
                                                    </span>
                                                )}
                                                {project.status === "REJECTED" && (
                                                    <span className="text-red-500 flex items-center">
                                                        <XCircle className="w-4 h-4 mr-1" /> Rejected
                                                    </span>
                                                )}
                                            </span>
                                        </div>

                                        {/* View Details Button */}
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="flex items-center bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors group-hover:shadow"
                                        >
                                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Button (when projects exist) */}
            {!loading && projects.length > 0 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                            setCurrentStep(1);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md transition-colors flex items-center gap-2 transform hover:scale-105"
                    >
                        <PlusCircle className="w-5 h-5" /> Create New Project
                    </button>
                </div>
            )}
            
            {/* Compact Multi-Step Modal with Improved Responsiveness */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-fadeIn" 
                     onClick={() => setIsModalOpen(false)}>
                    <div
                        className="relative bg-gray-950 w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg shadow-xl border border-gray-800 max-h-[90vh] flex flex-col animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header - More compact */}
                        <div className="sticky top-0 z-10 bg-gray-950 p-3 sm:p-4 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-400" />
                                <span>Create New Project</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
            
                        {/* Progress Indicator - More compact */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3">
                            <div className="flex justify-between mb-1">
                                {[1, 2, 3].map((step) => (
                                    <span
                                        key={step}
                                        className={`text-xs font-medium ${
                                            currentStep >= step ? "text-amber-400" : "text-gray-500"
                                        }`}
                                    >
                                        Step {step}
                                    </span>
                                ))}
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-amber-500 h-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                        </div>
            
                        {/* Form Content - Scrollable with constrained height */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-y-auto flex-grow custom-scrollbar" 
                             style={{ maxHeight: "calc(70vh - 140px)" }}>
                            {renderStep()}
                        </div>
            
                        {/* Navigation Buttons - More compact */}
                        <div className="sticky bottom-0 z-10 bg-gray-950 px-3 sm:px-4 py-3 border-t border-gray-800 flex justify-between">
                            {currentStep > 1 ? (
                                <button
                                    onClick={handlePrevStep}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm"
                                >
                                    Previous
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                            {currentStep < totalSteps ? (
                                <button
                                    onClick={handleNextStep}
                                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreateProject}
                                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                >
                                    Create Project
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Animations and background effects */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Custom Scrollbar for Modal */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(245, 158, 11, 0.3);
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
}