import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import {
    fetchAllProjects,
    applyForPosition,
    createProject,
    fetchCategories,
} from "../../services/userService/UserService.js";
import { LayoutDashboard, LogOut, PlusCircle, X, ChevronRight } from "lucide-react";
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
                title: "Hive Created! 🏗️",
                text: "Your project hive has been built successfully!",
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

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14]">
                <div className="flex h-16 items-center justify-between px-6">
                    <h1 className="text-3xl font-bold text-yellow-400">🐝 Welcome to the Hive</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-md flex items-center"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Build a Hive
                        </button>
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
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-4xl font-bold text-white mb-8">Explore Hives &amp; Join the Colony</h2>
                {projects.length === 0 ? (
                    <p className="text-gray-400">No projects available at the moment.</p>
                ) : (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="relative bg-[#12141F] rounded-lg shadow-lg border border-yellow-500 transform hover:scale-105 transition duration-300 overflow-hidden p-6"
                            >
                                <div className="absolute top-0 right-0 bg-yellow-500 px-3 py-1 text-black text-xs font-bold rounded-bl-lg">
                                    {project.stage || "Ongoing"}
                                </div>
                                <h3 className="text-2xl font-bold text-yellow-400">{project.name}</h3>
                                <p className="text-gray-400 mt-2">{project.description}</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    <span className="font-semibold text-white">Category:</span> {project.category || "Uncategorized"}
                                </p>
                                <div className="mt-3">
                                    <h4 className="text-lg font-semibold text-white mb-2">Open Positions:</h4>
                                    <ul className="text-gray-300 text-sm space-y-2">
                                        {project.positions.length > 0 ? (
                                            project.positions.map((position, index) => (
                                                <li
                                                    key={index}
                                                    className="flex justify-between bg-gray-800 p-2 rounded-md"
                                                >
                                                    <span>{position.roleName}</span>
                                                    <span className="text-yellow-400">
                            {position.quantity} spots left
                          </span>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No open positions.</p>
                                        )}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="w-full inline-block text-center bg-yellow-500 text-black px-6 py-3 rounded-md text-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                                    >
                                        View Details
                                        <ChevronRight className="inline-block w-5 h-5 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative bg-[#1C1F2E] w-full max-w-4xl h-[80vh] overflow-y-auto rounded-lg shadow-lg border border-yellow-500 p-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">🐝 Build Your Hive</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Hive Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                className="w-full p-3 border bg-gray-800 text-white rounded"
                            />
                            <textarea
                                placeholder="Describe your Hive..."
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className="w-full p-3 border bg-gray-800 text-white rounded h-24"
                            />
                            <select
                                className="w-full p-3 border bg-gray-800 text-white rounded"
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
                                className="w-full p-3 border bg-gray-800 text-white rounded"
                            />
                            <textarea
                                placeholder="What problem does this project solve?"
                                value={newProject.problemToFix}
                                onChange={(e) => setNewProject({ ...newProject, problemToFix: e.target.value })}
                                className="w-full p-3 border bg-gray-800 text-white rounded h-24"
                            />
                            <h3 className="text-white font-semibold text-lg mb-3">Optional Questions for Applicants</h3>
                            <input
                                type="text"
                                placeholder="Question 1 for applicants (Optional)"
                                value={newProject.question1}
                                onChange={(e) => setNewProject({ ...newProject, question1: e.target.value })}
                                className="w-full p-3 border bg-gray-800 text-white rounded"
                            />
                            {newProject.question1 && (
                                <input
                                    type="text"
                                    placeholder="Question 2 for applicants (Optional)"
                                    value={newProject.question2}
                                    onChange={(e) => setNewProject({ ...newProject, question2: e.target.value })}
                                    className="w-full p-3 border bg-gray-800 text-white rounded"
                                />
                            )}
                            <select
                                className="w-full p-3 border bg-gray-800 text-white rounded"
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
                                <div key={index} className="bg-gray-900 p-4 rounded-md mb-3">
                                    <input
                                        type="text"
                                        placeholder="Role Name"
                                        value={position.roleName}
                                        onChange={(e) => {
                                            const updatedPositions = [...newProject.positions];
                                            updatedPositions[index].roleName = e.target.value;
                                            setNewProject({ ...newProject, positions: updatedPositions });
                                        }}
                                        className="w-full p-2 mb-2 border bg-gray-800 text-white rounded"
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
                                            className="mr-2"
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
                                        className="w-full p-2 mt-2 border bg-gray-800 text-white rounded"
                                    />
                                    <button
                                        onClick={() => {
                                            const updatedPositions = newProject.positions.filter((_, i) => i !== index);
                                            setNewProject({ ...newProject, positions: updatedPositions });
                                        }}
                                        className="text-red-500 mt-2 hover:text-red-700 text-sm"
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
                                className="text-blue-500 hover:text-blue-400 mt-2 text-sm"
                            >
                                + Add Position
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded text-lg w-full transition transform hover:scale-105"
                                onClick={handleCreateProject}
                            >
                                Create Hive
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}