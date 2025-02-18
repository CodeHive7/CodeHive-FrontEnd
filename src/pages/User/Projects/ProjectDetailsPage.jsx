import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProjectById, applyForPosition } from "../../../services/userService/UserService.js";
import { ArrowLeft, Globe, User, Briefcase, CheckCircle } from "lucide-react";
import { getAccessToken } from "../../../services/Auth/tokenService.js";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedInUsername, setLoggedInUsername] = useState("");

    useEffect(() => {
        loadProject();
        decodeToken();
    }, []);

    const loadProject = async () => {
        try {
            const data = await fetchProjectById(projectId);
            setProject(data);
        } catch (error) {
            console.error("Error fetching project details", error);
        } finally {
            setLoading(false);
        }
    };

    const decodeToken = () => {
        const accessToken = getAccessToken();
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                setLoggedInUsername(decodedToken.sub);
            } catch (error) {
                console.error("Error decoding JWT token", error);
            }
        }
    };

    const handleApply = async (positionId) => {
        const positionIndex = project.positions.findIndex(pos => pos.id === positionId);
        if (positionIndex === -1) return;

        if (project.creatorName === loggedInUsername) {
            Swal.fire({
                icon: "warning",
                title: "Application Not Allowed",
                text: "You cannot apply for your own project.",
            });
            return;
        }

        if (project.positions[positionIndex].quantity === 0) {
            Swal.fire({
                icon: "info",
                title: "No Spots Left",
                text: "This position is already filled.",
            });
            return;
        }

        const hasQuestion1 = project.question1 && project.question1.trim() !== "";
        const hasQuestion2 = project.question2 && project.question2.trim() !== "";

        const processApplication = async (answers) => {
            try {
                await applyForPosition(projectId, positionId, answers);

                // 🔹 Update position quantity in state immediately
                setProject((prevProject) => {
                    const updatedPositions = [...prevProject.positions];
                    updatedPositions[positionIndex] = {
                        ...updatedPositions[positionIndex],
                        quantity: Math.max(0, updatedPositions[positionIndex].quantity - 1),
                    };
                    return { ...prevProject, positions: updatedPositions };
                });

                Swal.fire({
                    icon: "success",
                    title: "Application Submitted",
                    text: "Your application has been successfully submitted!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Application Failed",
                    text: error.response?.data || "An error occurred while applying. Please try again later.",
                });
            }
        };

        if (hasQuestion1 || hasQuestion2) {
            Swal.fire({
                title: "Answer the Questions",
                html: `
                    ${hasQuestion1 ? `<p class="text-left text-black font-semibold">${project.question1}</p>
                    <input id="answer1" class="swal2-input" placeholder="Your answer" required>` : ''}
                    
                    ${hasQuestion2 ? `<p class="text-left text-black font-semibold">${project.question2}</p>
                    <input id="answer2" class="swal2-input" placeholder="Your answer" required>` : ''}
                `,
                showCancelButton: true,
                confirmButtonText: "Submit Application",
                cancelButtonText: "Cancel",
                focusConfirm: false,
                preConfirm: () => {
                    const answer1 = document.getElementById("answer1")?.value.trim() || "";
                    const answer2 = document.getElementById("answer2")?.value.trim() || "";

                    if ((hasQuestion1 && !answer1) || (hasQuestion2 && !answer2)) {
                        Swal.showValidationMessage("Please answer all required questions.");
                        return false;
                    }

                    return { answer1, answer2 };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    processApplication(result.value);
                }
            });
        } else {
            processApplication({ answer1: "", answer2: "" });
        }
    };

    if (loading) {
        return <p className="text-gray-400 text-center text-lg">Loading project details...</p>;
    }

    if (!project) {
        return <p className="text-gray-400 text-center text-lg">Project not found.</p>;
    }

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white px-6 py-12">
            {/* Back Button */}
            <div className="max-w-5xl mx-auto mb-6">
                <Link to="/" className="flex items-center text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Projects
                </Link>
            </div>

            {/* Project Details Container */}
            <div className="max-w-5xl mx-auto bg-[#181A28] p-10 rounded-xl shadow-lg border border-gray-700">
                {/* Project Header */}
                <div className="pb-6 border-b border-gray-700">
                    <h1 className="text-4xl font-bold text-white">{project.name}</h1>
                    <p className="text-gray-400 mt-2">
                        <span className="font-semibold text-white">Category:</span> {project.category || "Uncategorized"}
                    </p>
                </div>

                {/* Creator & Status */}
                <div className="mt-6 flex items-center gap-8">
                    <div className="flex items-center gap-2 text-gray-400">
                        <User className="w-5 h-5 text-white" />
                        <span><strong>Created By:</strong> {project.creatorName?.toUpperCase() || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle className={`w-5 h-5 ${project.status === 'ACCEPTED' ? 'text-green-500' : 'text-yellow-400'}`} />
                        <span><strong>Status:</strong> {project.status}</span>
                    </div>
                </div>

                {/* Project Description */}
                <div className="mt-6 bg-[#222435] p-5 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">Project Description</h3>
                    <p className="text-gray-300">{project.description}</p>
                </div>

                {/* Website Link */}
                {project.websiteUrl && (
                    <div className="mt-6">
                        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-blue-500 hover:underline">
                            <Globe className="w-5 h-5 mr-2" /> Visit Project Website
                        </a>
                    </div>
                )}

                {/* Available Positions */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">Available Positions</h3>

                    {project.positions.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.positions.map((position) => (
                                <div key={position.id} className="bg-[#222435] p-5 rounded-lg shadow-md border border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-white">{position.roleName}</h4>
                                        <span className="text-yellow-400">{position.quantity} spots left</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1 flex items-center">
                                        <Briefcase className="w-4 h-4 mr-1 text-gray-500" />
                                        {position.paid ? "Paid Position" : "Unpaid"}
                                    </p>

                                    {/* Apply Button */}
                                    <button
                                        onClick={() => handleApply(position.id)}
                                        disabled={position.quantity === 0}
                                        className={`w-full mt-4 px-4 py-2 rounded-lg text-md font-semibold transition ${
                                            position.quantity === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {position.quantity === 0 ? "No Spots Left" : "Apply Now"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400">No positions available for this project.</p>}
                </div>
            </div>
        </div>
    );
}
