import { useState } from "react";
import { FolderKanban, CheckCircle, XCircle, Clock, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyProjectsPage() {
    // Fake projects data
    const [projects] = useState([
        {
            id: 1,
            name: "E-Commerce App",
            description: "A full-fledged e-commerce platform built with React and Spring Boot.",
            status: "ACCEPTED",
        },
        {
            id: 2,
            name: "AI Chatbot",
            description: "An AI chatbot for customer support, powered by OpenAI.",
            status: "PENDING",
        },
        {
            id: 3,
            name: "Social Media App",
            description: "A modern social media platform with real-time chat features.",
            status: "REJECTED",
        },
        {
            id: 4,
            name: "Crypto Wallet",
            description: "A secure cryptocurrency wallet with multi-chain support.",
            status: "ACCEPTED",
        },
    ]);

    return (
        <div className="max-w-5xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-white">My Projects</h2>
                <Link to="/user/create-project">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition">
                        <PlusCircle className="w-5 h-5" />
                        Create New Project
                    </button>
                </Link>
            </div>

            {/* Projects List */}
            {projects.length > 0 ? (
                <div className="space-y-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-[#222435] p-5 rounded-lg shadow-md border border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-semibold text-white">{project.name}</h4>
                                    <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                                </div>

                                {/* Project Status */}
                                <div className="flex items-center gap-2">
                                    {project.status === "ACCEPTED" && (
                                        <span className="flex items-center text-green-500 text-sm">
                                            <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                        </span>
                                    )}
                                    {project.status === "PENDING" && (
                                        <span className="flex items-center text-yellow-500 text-sm">
                                            <Clock className="w-5 h-5 mr-1" /> Pending
                                        </span>
                                    )}
                                    {project.status === "REJECTED" && (
                                        <span className="flex items-center text-red-500 text-sm">
                                            <XCircle className="w-5 h-5 mr-1" /> Rejected
                                        </span>
                                    )}
                                </div>
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
