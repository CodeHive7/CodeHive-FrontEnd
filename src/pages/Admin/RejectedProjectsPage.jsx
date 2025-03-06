import { useState, useEffect } from "react";
import { fetchRejectedProjects } from "../../services/adminService/adminService.js";
import { Globe, XCircle, Info } from "lucide-react";

// Helper function to chunk an array into subarrays
function chunkArray(array, size = 2) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export default function RejectedProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const data = await fetchRejectedProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white py-8">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 text-center text-red-500">Rejected Projects</h1>

                {loading ? (
                    <p className="text-gray-400 text-center text-lg">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <p className="text-gray-400 text-center text-lg">No rejected projects found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-[#181A28] p-6 rounded-lg shadow-lg border border-red-500 transition hover:shadow-2xl transform hover:scale-105"
                            >
                                {/* Project Header */}
                                <div className="border-b border-red-500 pb-4 mb-4 flex justify-between">
                                    <h3 className="text-2xl font-bold text-red-500">{project.name}</h3>
                                    <p className="text-sm text-gray-400">#{project.id}</p>
                                </div>

                                {/* Project Details */}
                                <div className="space-y-2">
                                    <p className="text-gray-300 text-lg">
                                        <span className="font-semibold text-white">Stage:</span> {project.stage}
                                    </p>
                                    <p className="text-gray-300 text-lg">
                                        <span className="font-semibold text-white">Category:</span> {project.category}
                                    </p>
                                    <p className="text-gray-300 text-lg">
                                        <span className="font-semibold text-white">Status:</span>{" "}
                                        <span className="font-bold text-red-500">Rejected</span>
                                    </p>
                                    {project.websiteUrl && (
                                        <p className="text-lg mt-3">
                                            <a
                                                href={project.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-red-400 hover:underline"
                                            >
                                                <Globe className="w-5 h-5 mr-2" /> Visit Website
                                            </a>
                                        </p>
                                    )}
                                </div>

                                {/* Project Description */}
                                <div className="mt-4 p-3 bg-gray-900 rounded-md shadow-sm">
                                    <p className="text-gray-300">
                                        <span className="font-semibold text-white">Description:</span> {project.description}
                                    </p>
                                </div>

                                {/* Rejection Feedback */}
                                {project.feedback && (
                                    <div className="mt-4 p-3 bg-[#222435] rounded-md shadow-md border border-gray-700">
                                        <p className="text-yellow-400 flex items-center gap-2">
                                            <XCircle className="w-5 h-5" /> Rejection Feedback
                                        </p>
                                        <p className="text-gray-300 text-sm mt-2">{project.feedback}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
