import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProjectById, applyForPosition } from "../../../services/userService/UserService.js";
import { ArrowLeft, Globe, User, Briefcase, CheckCircle, Users, Calendar, Loader2, Clock, XCircle } from "lucide-react";
import { getAccessToken } from "../../../services/Auth/tokenService.js";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const navigate = useNavigate();

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
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308"
            });
            return;
        }

        if (project.positions[positionIndex].quantity === 0) {
            Swal.fire({
                icon: "info",
                title: "No Spots Left",
                text: "This position is already filled.",
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308"
            });
            return;
        }

        const hasQuestion1 = project.question1 && project.question1.trim() !== "";
        const hasQuestion2 = project.question2 && project.question2.trim() !== "";

        const processApplication = async (answers) => {
            try {
                await applyForPosition(projectId, positionId, answers);

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
                    text: "You have successfully applied for this position!",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#1C1F2E",
                    color: "#ffffff",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Application Failed",
                    text: error.response?.data || "An error occurred while applying. Please try again later.",
                    background: "#1C1F2E",
                    color: "#ffffff",
                    confirmButtonColor: "#EAB308"
                });
            }
        };

        if (hasQuestion1 || hasQuestion2) {
            Swal.fire({
                title: "Answer the Questions",
                html: `
                    ${hasQuestion1 ? `<p class="text-left font-semibold">${project.question1}</p>
                    <input id="answer1" class="swal2-input" placeholder="Your answer" required>` : ''}
                    ${hasQuestion2 ? `<p class="text-left font-semibold">${project.question2}</p>
                    <input id="answer2" class="swal2-input" placeholder="Your answer" required>` : ''}
                `,
                showCancelButton: true,
                confirmButtonText: "Submit Application",
                cancelButtonText: "Cancel",
                focusConfirm: false,
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308",
                cancelButtonColor: "#4B5563",
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
        return (
            <div className="min-h-screen bg-[#0A0B14] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#0A0B14] flex flex-col items-center justify-center">
                <p className="text-gray-400 text-center text-lg">Project not found.</p>
            </div>
        );
    }

    // Get stage badge color
    const getStageBadgeColor = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return "bg-blue-500";
            case "IN_DEVELOPMENT": return "bg-yellow-500";
            case "FINISHED": return "bg-green-500";
            case "NEEDS_FIXES": return "bg-red-500";
            default: return "bg-purple-500";
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

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14]">
                <div className="flex h-16 items-center justify-between px-6">
                    <h1 className="text-3xl font-bold text-yellow-400">🐝 Hive Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-yellow-400 hover:text-yellow-300 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Return
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="honeycomb-cell group bg-gradient-to-br from-[#12141F] to-[#191c2e] rounded-lg overflow-hidden shadow-lg border-l-2 border-r-2 border-yellow-500/30 transform transition-all duration-300">
                    {/* Hexagonal design elements */}
                    <div className="absolute -left-3 -top-3 w-12 h-12 bg-yellow-500/20 rounded-full"></div>
                    <div className="absolute -right-4 -bottom-4 w-14 h-14 bg-yellow-500/10 rounded-full"></div>

                    {/* Stage badge */}
                    <div className={`absolute top-0 right-0 ${getStageBadgeColor(project.stage)} px-3 py-1 text-black text-xs font-bold rounded-bl-lg`}>
                        {getStageDisplayName(project.stage)}
                    </div>

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                                        {project.category || "Uncategorized"}
                                    </span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                {project.status === "ACCEPTED" && (
                                    <span className="flex items-center text-green-400 bg-green-900/20 px-2 py-1 rounded-lg border border-green-600/30">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Active
                                    </span>
                                )}
                                {project.status === "PENDING" && (
                                    <span className="flex items-center text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-600/30">
                                        <Clock className="w-4 h-4 mr-1" /> Pending
                                    </span>
                                )}
                                {project.status === "REJECTED" && (
                                    <span className="flex items-center text-red-400 bg-red-900/20 px-2 py-1 rounded-lg border border-red-600/30">
                                        <XCircle className="w-4 h-4 mr-1" /> Rejected
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Project info */}
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <div className="flex items-center">
                                <User className="w-4 h-4 text-yellow-400 mr-1" />
                                <span>Created by <span className="font-medium text-white">{project.creatorName}</span></span>
                            </div>
                            {project.createdAt && (
                                <div className="flex items-center text-gray-400">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-5 text-gray-300">
                            <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                                <span className="mr-2">Description</span>
                                <div className="h-px bg-yellow-500/30 flex-grow"></div>
                            </h4>
                            <p className="bg-[#181A28]/50 p-4 rounded-md border border-yellow-500/10">
                                {project.description}
                            </p>
                        </div>

                        {/* Website Link */}
                        {project.websiteUrl && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                                    <span className="mr-2">Project Link</span>
                                    <div className="h-px bg-yellow-500/30 flex-grow"></div>
                                </h4>
                                <a
                                    href={project.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-[#181A28]/50 p-3 rounded-md border border-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    {project.websiteUrl}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Positions Section */}
                <div className="mt-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                        <span className="relative inline-block">
                            <span className="relative z-10">Available Positions</span>
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-500 opacity-20 rounded"></span>
                        </span>
                    </h2>

                    {project.positions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {project.positions.map((position) => (
                                <div
                                    key={position.id}
                                    className="honeycomb-cell group bg-gradient-to-br from-[#12141F] to-[#191c2e] rounded-lg overflow-hidden shadow-lg border-l-2 border-r-2 border-yellow-500/30 transform transition-all duration-300"
                                >
                                    {/* Hexagonal design elements */}
                                    <div className="absolute -left-3 -top-3 w-8 h-8 bg-yellow-500/20 rounded-full"></div>
                                    <div className="absolute -right-3 -bottom-3 w-8 h-8 bg-yellow-500/10 rounded-full"></div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-xl font-bold text-white">{position.roleName}</h4>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                position.quantity > 0 
                                                    ? 'bg-yellow-500/20 text-yellow-400' 
                                                    : 'bg-gray-800 text-gray-400'
                                            }`}>
                                                {position.quantity} {position.quantity === 1 ? 'spot' : 'spots'} left
                                            </span>
                                        </div>

                                        <div className="flex items-center mb-4 text-sm">
                                            <div className="bg-yellow-500/10 rounded-full p-1.5">
                                                <Briefcase className="w-4 h-4 text-yellow-400" />
                                            </div>
                                            <span className="ml-2 text-gray-300">
                                                {position.paid ? "Paid Position" : "Volunteer Position"}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleApply(position.id)}
                                            disabled={position.quantity === 0}
                                            className={`w-full mt-3 px-4 py-2.5 rounded-md font-medium transition-all ${
                                                position.quantity === 0 
                                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                                                    : "bg-yellow-500 hover:bg-yellow-600 text-black"
                                            }`}
                                        >
                                            {position.quantity === 0 ? "No Spots Available" : "Apply Now"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gradient-to-br from-[#12141F] to-[#191c2e] rounded-lg border-l-2 border-r-2 border-yellow-500/30">
                            <p className="text-gray-400">No positions available for this project at this time.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Honeycomb decoration (visible on larger screens) */}
            <div className="hidden lg:block absolute -right-20 top-1/3 opacity-10 pointer-events-none">
                <div className="honeycomb-decor w-48 h-48 border-2 border-yellow-500 rotate-12"></div>
            </div>
            <div className="hidden lg:block absolute -left-16 bottom-1/4 opacity-5 pointer-events-none">
                <div className="honeycomb-decor w-36 h-36 border-2 border-yellow-500 -rotate-12"></div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23EAB308' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                    backgroundSize: "112px 200px"
                }}>
            </div>
        </div>
    );
}