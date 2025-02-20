import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../../context/Auth/AuthContext.jsx";
import { fetchAllProjects, applyForPosition, createProject, fetchCategories } from "../../services/userService/UserService.js";
import { LayoutDashboard, LogOut, ArrowRight, PlusCircle, X } from "lucide-react";
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
        question1: "",
        question2: "",
        selectedCategory: "",
        positions: [{ roleName: "", paid: false, quantity: 1 }],
    });

    const {logoutHandler} = useAuth();

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
                text: "Please fill in all required fields before submitting .",
            })
        }
        try {
            await createProject(newProject);
            Swal.fire({
                icon: "success",
                title: "Project Created!",
                text: "Your Project has been created successfully",
                timer: 2000,
                showConfirmButton: false,
            });
            setIsModalOpen(false);
            loadProjects();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Creating Project",
                text:error.response?.data || "An error occurred while creating the project. Please try again.",
            });
        }
    };



    return (
        <div className="min-h-screen bg-[#0A0B14] text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14]">
                <div className="flex h-16 items-center justify-between px-6">
                    <h1 className="text-2xl font-semibold">Explore Projects</h1>
                    <div className="flex items-center gap-4">
                        {/* Create Project Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Create Project
                        </button>
                        {/* Dashboard Icon */}
                        <Link to="/user" className="hover:bg-gray-800 p-2 rounded-md">
                            <LayoutDashboard className="h-6 w-6 text-white" />
                        </Link>
                        {/* Logout Icon */}
                        <button onClick={logoutHandler} className="hover:bg-gray-800 p-2 rounded-md">
                            <LogOut className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Projects Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-4xl font-bold text-white mb-8">Browse & Apply For Projects</h2>

                {projects.length === 0 ? (
                    <p className="text-gray-400">No projects available at the moment.</p>
                ) : (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-[#12141F] rounded-lg shadow-lg border border-gray-700 transform hover:scale-105 transition duration-300 overflow-hidden p-6"
                            >
                                {/* Project Title */}
                                <h3 className="text-2xl font-bold text-blue-400">{project.name}</h3>

                                {/* Project Description */}
                                <p className="text-gray-400 mt-2">{project.description}</p>

                                {/* Project Category */}
                                <p className="text-gray-500 text-sm mt-2">
                                    <span className="font-semibold text-white">Category:</span> {project.category ? project.category : "Uncategorized"}
                                </p>

                                {/* Positions & Availability */}
                                <div className="mt-3">
                                    <h4 className="text-lg font-semibold text-white mb-2">Open Positions:</h4>
                                    <ul className="text-gray-300 text-sm space-y-2">
                                        {project.positions.length > 0 ? (
                                            project.positions.map((position, index) => (
                                                <li key={index}
                                                    className="flex justify-between bg-gray-800 p-2 rounded-md">
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

                                {/* View & Apply Button */}
                                <div className="mt-6">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="w-full inline-block text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:shadow-lg transition"
                                    >
                                        View Details & Apply
                                        <ArrowRight className="inline-block w-5 h-5 ml-2"/>
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
                    <div
                        className="relative bg-[#1C1F2E] w-full max-w-5xl h-[90vh] overflow-y-auto rounded-lg shadow-lg border border-gray-700 p-8">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white"
                        >
                            <X className="w-8 h-8"/>
                        </button>

                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create a New Project</h2>

                        {/* Scrollable Content */}
                        <div className="max-h-[80vh] overflow-y-auto px-4">
                            {/* Project Name */}
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded"
                            />

                            {/* Project Description */}
                            <textarea
                                placeholder="Project Description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded h-24"
                            />

                            {/* Select Project Stage */}
                            <select
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded"
                                value={newProject.stage}
                                onChange={(e) => setNewProject({...newProject, stage: e.target.value})}
                            >
                                <option value="">Select Stage</option>
                                <option value="NOT_STARTED">Not Started</option>
                                <option value="IN_DEVELOPMENT">In Development</option>
                                <option value="FINISHED">Finished</option>
                                <option value="NEEDS_FIXES">Needs Fixes</option>
                            </select>

                            {/* Website URL */}
                            <input
                                type="text"
                                placeholder="Website URL (optional)"
                                value={newProject.websiteUrl}
                                onChange={(e) => setNewProject({ ...newProject, websiteUrl: e.target.value })}
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded"
                            />

                            {/* Problem to Fix */}
                            <textarea
                                placeholder="What problem does this project solve?"
                                value={newProject.problemToFix}
                                onChange={(e) => setNewProject({ ...newProject, problemToFix: e.target.value })}
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded h-24"
                            />

                            {/* Project Questions (Up to 2) */}
                            <h3 className="text-white font-semibold text-lg mb-3">Optional Questions for Applicants</h3>

                            {/* First Question */}
                            <input
                                type="text"
                                placeholder="Question 1 for applicants (Optional)"
                                value={newProject.question1}
                                onChange={(e) => setNewProject({ ...newProject, question1: e.target.value })}
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded"
                            />

                            {/* Second Question - Appears Only If First Question Exists */}
                            {newProject.question1 && (
                                <input
                                    type="text"
                                    placeholder="Question 2 for applicants (Optional)"
                                    value={newProject.question2}
                                    onChange={(e) => setNewProject({ ...newProject, question2: e.target.value })}
                                    className="w-full p-3 mb-4 border bg-gray-800 text-white rounded"
                                />
                            )}

                            {/* Select Category */}
                            <select
                                className="w-full p-3 mb-4 border bg-gray-800 text-white rounded"
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

                            {/* Positions Section */}
                            <h3 className="text-white font-semibold text-lg mb-3">Project Positions</h3>

                            {newProject.positions.map((position, index) => (
                                <div key={index} className="bg-gray-900 p-4 mb-3 rounded-md">
                                    {/* Role Name */}
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

                                    {/* Paid Checkbox */}
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

                                    {/* Quantity */}
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

                                    {/* Remove Position Button */}
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

                            {/* Add Position Button */}
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

                        {/* Submit Button */}
                        <div className="mt-6 text-center">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg w-full transition"
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
