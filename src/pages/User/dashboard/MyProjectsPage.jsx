import { useState, useEffect } from "react";
import { FolderKanban, CheckCircle, XCircle, Clock, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMyProjects } from "../../../services/userService/UserService.js";

export default function MyProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchMyProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-gray-400 text-center text-lg">Loading your projects...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#0A0B14] to-[#12141F] p-8 rounded-xl shadow-lg border border-yellow-500 mt-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <FolderKanban className="w-7 h-7 text-yellow-500" /> My Projects
                </h1>
                <Link
                    to="/user/create-project"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                    <PlusCircle className="w-5 h-5" /> Create New Project
                </Link>
            </div>

            {/* Project List */}
            {projects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-[#222435] p-6 rounded-lg shadow-md border border-gray-700 hover:scale-105 transition duration-300"
                        >
                            {/* Project Title */}
                            <h4 className="text-2xl font-semibold text-white">{project.name}</h4>
                            <p className="text-gray-400 text-sm mt-1">{project.description}</p>

                            {/* Project Status */}
                            <div className="flex items-center gap-2 mt-3">
                                {project.status === "ACCEPTED" && (
                                    <span className="flex items-center text-green-500 text-sm bg-green-800/30 px-2 py-1 rounded-lg">
                                        <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                    </span>
                                )}
                                {project.status === "PENDING" && (
                                    <span className="flex items-center text-yellow-500 text-sm bg-yellow-800/30 px-2 py-1 rounded-lg">
                                        <Clock className="w-5 h-5 mr-1" /> Pending
                                    </span>
                                )}
                                {project.status === "REJECTED" && (
                                    <span className="flex items-center text-red-500 text-sm bg-red-800/30 px-2 py-1 rounded-lg">
                                        <XCircle className="w-5 h-5 mr-1" /> Rejected
                                    </span>
                                )}
                            </div>

                            {/* See Details Button */}
                            <div className="mt-4">
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition"
                                >
                                    See Details <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center text-lg">You haven't created any projects yet.</p>
            )}
        </div>
    );
}
