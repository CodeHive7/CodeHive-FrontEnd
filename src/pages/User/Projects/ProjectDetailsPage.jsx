import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProjectById, applyForPosition } from "../../../services/userService/UserService.js";
import { 
  ArrowLeft, Globe, User, Briefcase, CheckCircle, Users, Calendar, 
  Loader2, Clock, XCircle, ChevronRight, Shield, Code, GitBranch, 
  Grid, Layers, ExternalLink, MessageSquare, Share2, AlertTriangle
} from "lucide-react";
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
                title: "Cannot Apply",
                text: "You cannot apply to your own project",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
            });
            return;
        }

        if (project.positions[positionIndex].quantity === 0) {
            Swal.fire({
                icon: "info",
                title: "Position Filled",
                text: "This position has reached its capacity",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
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
                    text: "Your application has been successfully submitted",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#111827",
                    color: "#ffffff",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Application Failed",
                    text: error.response?.data || "There was an error submitting your application",
                    background: "#111827",
                    color: "#ffffff",
                    confirmButtonColor: "#F59E0B"
                });
            }
        };

        if (hasQuestion1 || hasQuestion2) {
            Swal.fire({
                title: "Application Questions",
                html: `
                    <div class="mb-4">
                        ${hasQuestion1 ? `
                            <div class="mb-3">
                                <p class="text-left font-semibold mb-2 text-amber-400">${project.question1}</p>
                                <textarea id="answer1" class="swal2-textarea w-full bg-gray-800 text-white border-gray-700" 
                                    placeholder="Your answer..." rows="3" required></textarea>
                            </div>` : ''}
                        ${hasQuestion2 ? `
                            <div>
                                <p class="text-left font-semibold mb-2 text-amber-400">${project.question2}</p>
                                <textarea id="answer2" class="swal2-textarea w-full bg-gray-800 text-white border-gray-700" 
                                    placeholder="Your answer..." rows="3" required></textarea>
                            </div>` : ''}
                    </div>
                    <p class="text-left text-sm text-gray-400 mb-2">Your responses will be shared with the project creator</p>
                `,
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Cancel",
                focusConfirm: false,
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B",
                cancelButtonColor: "#4B5563",
                preConfirm: () => {
                    const answer1 = document.getElementById("answer1")?.value.trim() || "";
                    const answer2 = document.getElementById("answer2")?.value.trim() || "";
                    if ((hasQuestion1 && !answer1) || (hasQuestion2 && !answer2)) {
                        Swal.showValidationMessage("Please answer all questions");
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

    // Get stage badge color and icon
    const getStageInfo = (stage) => {
        switch(stage) {
            case "NOT_STARTED": 
                return { 
                    color: "bg-amber-600", 
                    textColor: "text-white",
                    icon: <Layers className="w-4 h-4 mr-1.5" /> 
                };
            case "IN_DEVELOPMENT": 
                return { 
                    color: "bg-amber-600", 
                    textColor: "text-white",
                    icon: <GitBranch className="w-4 h-4 mr-1.5" /> 
                };
            case "FINISHED": 
                return { 
                    color: "bg-green-600", 
                    textColor: "text-white",
                    icon: <CheckCircle className="w-4 h-4 mr-1.5" /> 
                };
            case "NEEDS_FIXES": 
                return { 
                    color: "bg-red-600", 
                    textColor: "text-white",
                    icon: <Grid className="w-4 h-4 mr-1.5" /> 
                };
            default: 
                return { 
                    color: "bg-amber-600", 
                    textColor: "text-white",
                    icon: <Code className="w-4 h-4 mr-1.5" /> 
                };
        }
    };

    // Get stage display name
    const getStageDisplayName = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return "Not Started";
            case "IN_DEVELOPMENT": return "In Development";
            case "FINISHED": return "Finished";
            case "NEEDS_FIXES": return "Needs Fixes";
            default: return stage || "Ongoing";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                <p className="text-gray-400 mt-4">Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 max-w-md w-full text-center shadow-md">
                    <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
                    <p className="text-gray-400 mb-6">
                        The project with ID {projectId} could not be found
                    </p>
                    <button 
                        onClick={() => navigate('/user')}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors inline-flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const stageInfo = getStageInfo(project.stage);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950 shadow-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link to="/user" className="text-2xl font-bold text-white flex items-center">
                            <span className="text-amber-500">Code</span>Hive
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-300 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-800">
                    {/* Project Header Section */}
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    {project.name}
                                </h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md text-xs font-medium inline-flex items-center">
                                        <Code className="w-3 h-3 mr-1.5" />
                                        {project.category || "Uncategorized"}
                                    </span>
                                    <span className={`${stageInfo.color} ${stageInfo.textColor} px-3 py-1 rounded-md text-xs font-medium inline-flex items-center`}>
                                        {stageInfo.icon}
                                        {getStageDisplayName(project.stage)}
                                    </span>
                                    {project.status === "ACCEPTED" && (
                                        <span className="inline-flex items-center bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium">
                                            <CheckCircle className="w-3 h-3 mr-1.5" /> Active
                                        </span>
                                    )}
                                    {project.status === "PENDING" && (
                                        <span className="inline-flex items-center bg-amber-600 text-white px-3 py-1 rounded-md text-xs font-medium">
                                            <Clock className="w-3 h-3 mr-1.5" /> Pending
                                        </span>
                                    )}
                                    {project.status === "REJECTED" && (
                                        <span className="inline-flex items-center bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium">
                                            <XCircle className="w-3 h-3 mr-1.5" /> Rejected
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        Swal.fire({
                                            toast: true,
                                            position: 'bottom-end',
                                            icon: 'success',
                                            title: 'Link copied to clipboard',
                                            showConfirmButton: false,
                                            timer: 2000,
                                            background: '#111827',
                                            color: '#ffffff'
                                        });
                                    }}
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                                    aria-label="Share project"
                                >
                                    <Share2 className="w-5 h-5 text-gray-400 hover:text-white" />
                                </button>
                                <button 
                                    onClick={() => {
                                        Swal.fire({
                                            icon: 'info',
                                            title: 'Send Message',
                                            text: `Would you like to send a message to ${project.creatorName}?`,
                                            background: '#111827',
                                            color: '#ffffff',
                                            confirmButtonColor: '#F59E0B',
                                            showCancelButton: true,
                                            confirmButtonText: "Send",
                                            cancelButtonText: "Cancel"
                                        });
                                    }}
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                                    aria-label="Message creator"
                                >
                                    <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Project Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-800 p-4 rounded-md">
                            <div className="flex items-center">
                                <User className="w-5 h-5 text-amber-500 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-500">Creator</p>
                                    <p className="font-medium text-white">{project.creatorName}</p>
                                </div>
                            </div>
                            
                            {project.createdAt && (
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-amber-500 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500">Created On</p>
                                        <p className="font-medium text-white">
                                            {new Date(project.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center">
                                <Users className="w-5 h-5 text-amber-500 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-500">Open Positions</p>
                                    <p className="font-medium text-white">
                                        {project.positions.reduce((acc, pos) => acc + pos.quantity, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="px-6 sm:px-8 py-6">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-amber-500 mb-4">
                                Description
                            </h3>
                            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 text-gray-300 leading-relaxed">
                                {project.description.split('\n').map((paragraph, i) => (
                                    <p key={i} className={i > 0 ? 'mt-4' : ''}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Project Link */}
                        {project.websiteUrl && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-amber-500 mb-4">
                                    Project Website
                                </h3>
                                <a
                                    href={project.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-gray-800 p-4 rounded-lg border border-gray-700 text-amber-500 hover:border-amber-500"
                                >
                                    <Globe className="w-5 h-5 text-amber-500 mr-3" />
                                    <div className="flex-grow">
                                        <div className="text-sm text-gray-400">Website URL</div>
                                        <div className="text-amber-500 font-medium truncate max-w-lg">
                                            {project.websiteUrl}
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Positions Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Available Positions
                    </h2>

                    {project.positions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.positions.map((position) => (
                                <div
                                    key={position.id}
                                    className="bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-800"
                                >
                                    <div className="p-6">
                                        {/* Position Header */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-white">
                                                    {position.roleName}
                                                </h3>
                                                <span className={`text-xs flex items-center px-2 py-1 rounded-md
                                                    ${position.quantity > 0 
                                                        ? 'bg-amber-600 text-white' 
                                                        : 'bg-gray-800 text-gray-400'
                                                    }`}
                                                >
                                                    {position.quantity > 0 
                                                        ? <CheckCircle className="w-3 h-3 mr-1" /> 
                                                        : <XCircle className="w-3 h-3 mr-1" />
                                                    }
                                                    {position.quantity} available
                                                </span>
                                            </div>
                                        </div>

                                        {/* Position Details */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center text-sm">
                                                <Briefcase className="w-4 h-4 mr-2 text-amber-500" />
                                                <span className={position.paid ? "text-green-400" : "text-gray-300"}>
                                                    {position.paid ? "Paid Position" : "Volunteer Position"}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm">
                                                <Shield className="w-4 h-4 mr-2 text-amber-500" />
                                                <span className="text-gray-300">
                                                    Application requires review
                                                </span>
                                            </div>
                                        </div>

                                        {/* Apply Button */}
                                        <button
                                            onClick={() => handleApply(position.id)}
                                            disabled={position.quantity === 0 || project.creatorName === loggedInUsername}
                                            className={`w-full px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center
                                                ${position.quantity === 0 
                                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                                                    : project.creatorName === loggedInUsername
                                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                                        : "bg-amber-600 hover:bg-amber-700 text-white"
                                                }`}
                                        >
                                            {position.quantity === 0 
                                                ? <XCircle className="w-4 h-4 mr-2" /> 
                                                : project.creatorName === loggedInUsername
                                                    ? <User className="w-4 h-4 mr-2" />
                                                    : <CheckCircle className="w-4 h-4 mr-2" />
                                            }
                                            {position.quantity === 0 
                                                ? "Position Filled" 
                                                : project.creatorName === loggedInUsername
                                                    ? "Your Project"
                                                    : "Apply for Position"
                                            }
                                            {!(position.quantity === 0 || project.creatorName === loggedInUsername) && (
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-gray-900 rounded-lg border border-gray-800">
                            <Users className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-300 mb-2">No Positions Available</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                There are currently no positions available for this project.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}