import { useState, useEffect } from "react";
import { fetchAcceptedProjects } from "../../services/adminService/adminService.js";

// Helper function to chunk an array into subarrays of given size.
// e.g. chunkArray([1,2,3,4], 2) => [[1,2], [3,4]]
function chunkArray(array, size = 2) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export default function AcceptedProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const data = await fetchAcceptedProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    // Break projects into chunks of 2
    const chunkedProjects = chunkArray(projects, 2);

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">Accepted Projects</h1>

                {loading ? (
                    <p className="text-gray-400 text-center text-lg">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <p className="text-gray-400 text-center text-lg">
                        No accepted projects found.
                    </p>
                ) : (
                    // Map over each "block" of up to 2 projects
                    chunkedProjects.map((chunk, blockIndex) => {
                        // Determine how many columns based on the chunk length
                        // 1 item => 1 col, 2 items => 2 cols
                        const colCount = chunk.length === 1 ? "grid-cols-1" : "grid-cols-2";

                        return (
                            <div
                                key={blockIndex}
                                className={`grid ${colCount} gap-8 mb-8 w-full`}
                            >
                                {chunk.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-[#12141F] p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col"
                                    >
                                        {/* Project Header */}
                                        <div className="border-b border-gray-600 pb-4 mb-4">
                                            <h3 className="text-2xl font-bold text-green-500">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Project ID: #{project.id}
                                            </p>
                                        </div>

                                        {/* Project Details */}
                                        <div className="space-y-2">
                                            <p className="text-gray-300 text-lg">
                                                <span className="font-semibold text-white">Stage:</span>{" "}
                                                {project.stage}
                                            </p>
                                            <p className="text-gray-300 text-lg">
                                                <span className="font-semibold text-white">Category:</span>{" "}
                                                {project.category}
                                            </p>
                                            <p className="text-gray-300 text-lg">
                                                <span className="font-semibold text-white">Status:</span>{" "}
                                                <span className="font-bold text-green-500">
                          Accepted
                        </span>
                                            </p>
                                            {project.websiteUrl && (
                                                <p className="text-lg mt-3">
                                                    <a
                                                        href={project.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        🔗 Visit Website
                                                    </a>
                                                </p>
                                            )}
                                        </div>

                                        {/* Project Description */}
                                        <div className="mt-4 p-3 bg-gray-900 rounded-md">
                                            <p className="text-gray-300">
                        <span className="font-semibold text-white">
                          Description:
                        </span>{" "}
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
