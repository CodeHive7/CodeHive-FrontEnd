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
                title: "AccessViolationException",
                text: "Error: Cannot apply to your own project",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B"
            });
            return;
        }

        if (project.positions[positionIndex].quantity === 0) {
            Swal.fire({
                icon: "info",
                title: "CapacityException",
                text: "position.quantity === 0",
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
                    title: "Application.submit()",
                    text: "return: Success { status: 200 }",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#111827",
                    color: "#ffffff",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "ApplicationException",
                    text: error.response?.data || "Error: API request failed with status 500",
                    background: "#111827",
                    color: "#ffffff",
                    confirmButtonColor: "#F59E0B"
                });
            }
        };

        if (hasQuestion1 || hasQuestion2) {
            Swal.fire({
                title: "position.questions[]",
                html: `
                    <div class="mb-4 font-mono">
                        ${hasQuestion1 ? `
                            <div class="mb-3">
                                <p class="text-left font-semibold mb-2 text-amber-400 font-mono">// ${project.question1}</p>
                                <textarea id="answer1" class="swal2-textarea w-full bg-gray-800 text-white border-gray-700 font-mono" 
                                    placeholder="response[0] = '...'" rows="3" required></textarea>
                            </div>` : ''}
                        ${hasQuestion2 ? `
                            <div>
                                <p class="text-left font-semibold mb-2 text-amber-400 font-mono">// ${project.question2}</p>
                                <textarea id="answer2" class="swal2-textarea w-full bg-gray-800 text-white border-gray-700 font-mono" 
                                    placeholder="response[1] = '...'" rows="3" required></textarea>
                            </div>` : ''}
                    </div>
                    <p class="text-left text-sm text-gray-400 mb-2 font-mono">// responses will be shared with project.creator</p>
                `,
                showCancelButton: true,
                confirmButtonText: "submit()",
                cancelButtonText: "cancel()",
                focusConfirm: false,
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B",
                cancelButtonColor: "#4B5563",
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-swal-confirm',
                    cancelButton: 'custom-swal-cancel'
                },
                preConfirm: () => {
                    const answer1 = document.getElementById("answer1")?.value.trim() || "";
                    const answer2 = document.getElementById("answer2")?.value.trim() || "";
                    if ((hasQuestion1 && !answer1) || (hasQuestion2 && !answer2)) {
                        Swal.showValidationMessage("ValidationError: required fields cannot be null");
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
                    color: "bg-blue-600", 
                    textColor: "text-blue-100",
                    borderColor: "border-blue-500/30", 
                    bgColor: "bg-blue-500/10",
                    icon: <Layers className="w-4 h-4 mr-1.5" /> 
                };
            case "IN_DEVELOPMENT": 
                return { 
                    color: "bg-amber-600", 
                    textColor: "text-amber-100",
                    borderColor: "border-amber-500/30", 
                    bgColor: "bg-amber-500/10",
                    icon: <GitBranch className="w-4 h-4 mr-1.5" /> 
                };
            case "FINISHED": 
                return { 
                    color: "bg-green-600", 
                    textColor: "text-green-100",
                    borderColor: "border-green-500/30", 
                    bgColor: "bg-green-500/10",
                    icon: <CheckCircle className="w-4 h-4 mr-1.5" /> 
                };
            case "NEEDS_FIXES": 
                return { 
                    color: "bg-red-600", 
                    textColor: "text-red-100",
                    borderColor: "border-red-500/30", 
                    bgColor: "bg-red-500/10",
                    icon: <Grid className="w-4 h-4 mr-1.5" /> 
                };
            default: 
                return { 
                    color: "bg-purple-600", 
                    textColor: "text-purple-100",
                    borderColor: "border-purple-500/30", 
                    bgColor: "bg-purple-500/10",
                    icon: <Code className="w-4 h-4 mr-1.5" /> 
                };
        }
    };

    // Get stage display name
    const getStageDisplayName = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return "NOT_STARTED";
            case "IN_DEVELOPMENT": return "IN_DEVELOPMENT";
            case "FINISHED": return "FINISHED";
            case "NEEDS_FIXES": return "NEEDS_FIXES";
            default: return stage || "ONGOING";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin relative z-10" />
                </div>
                <p className="text-gray-400 mt-4 animate-pulse font-mono">project.loading(id: {projectId})</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
                <div className="bg-gray-900 rounded-md border border-gray-800 p-8 max-w-md w-full text-center shadow-lg">
                    <div className="bg-gray-800/50 rounded-md p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="h-10 w-10 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 font-mono">NotFoundException</h2>
                    <p className="text-gray-400 mb-6 font-mono">Error: project with id={projectId} not found</p>
                    <button 
                        onClick={() => navigate('/user')}
                        className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-md font-medium transition-colors inline-flex items-center font-mono"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> homepage.return()
                    </button>
                </div>
            </div>
        );
    }

    const stageInfo = getStageInfo(project.stage);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm shadow-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link to="/user" className="text-2xl font-bold text-white flex items-center font-mono">
                            <span className="text-amber-400">Code</span>Hive
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-300 hover:text-amber-400 transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> back()
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-900 rounded-md overflow-hidden shadow-lg border border-gray-800 hover:border-amber-500/30 transition-colors duration-300">
                    {/* Project Header Section with enhanced visuals */}
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-60"></div>
                        <div className="relative z-10 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-amber-300 transition-colors font-mono">
                                        {project.name}
                                    </h1>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-md text-xs font-medium inline-flex items-center font-mono">
                                            <Code className="w-3 h-3 mr-1.5" />
                                            {project.category || "UNCATEGORIZED"}
                                        </span>
                                        <span className={`${stageInfo.bgColor} ${stageInfo.textColor} px-3 py-1 rounded-md text-xs font-medium inline-flex items-center border ${stageInfo.borderColor} font-mono`}>
                                            {stageInfo.icon}
                                            {getStageDisplayName(project.stage)}
                                        </span>
                                        {project.status === "ACCEPTED" && (
                                            <span className="inline-flex items-center text-green-400 bg-green-900/20 px-3 py-1 rounded-md text-xs font-medium border border-green-600/30 font-mono">
                                                <CheckCircle className="w-3 h-3 mr-1.5" /> ACTIVE
                                            </span>
                                        )}
                                        {project.status === "PENDING" && (
                                            <span className="inline-flex items-center text-amber-400 bg-amber-900/20 px-3 py-1 rounded-md text-xs font-medium border border-amber-600/30 font-mono">
                                                <Clock className="w-3 h-3 mr-1.5" /> PENDING
                                            </span>
                                        )}
                                        {project.status === "REJECTED" && (
                                            <span className="inline-flex items-center text-red-400 bg-red-900/20 px-3 py-1 rounded-md text-xs font-medium border border-red-600/30 font-mono">
                                                <XCircle className="w-3 h-3 mr-1.5" /> REJECTED
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
                                                title: 'navigator.clipboard.writeText(url)',
                                                showConfirmButton: false,
                                                timer: 2000,
                                                background: '#111827',
                                                color: '#ffffff'
                                            });
                                        }}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                                        aria-label="Share project"
                                    >
                                        <Share2 className="w-5 h-5 text-gray-400 hover:text-amber-400" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            // Would be connected to message function in a real app
                                            Swal.fire({
                                                icon: 'info',
                                                title: 'user.message()',
                                                text: `// send message to ${project.creatorName}`,
                                                background: '#111827',
                                                color: '#ffffff',
                                                confirmButtonColor: '#F59E0B',
                                                showCancelButton: true,
                                                confirmButtonText: "send()",
                                                cancelButtonText: "cancel()"
                                            });
                                        }}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                                        aria-label="Message creator"
                                    >
                                        <MessageSquare className="w-5 h-5 text-gray-400 hover:text-amber-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Project Metadata with improved layout */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-950/50 p-4 rounded-md border border-gray-800/50">
                                <div className="flex items-center">
                                    <div className="bg-amber-500/10 rounded-md p-2 mr-3">
                                        <User className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-mono">.creator</p>
                                        <p className="font-medium text-white font-mono">{project.creatorName}</p>
                                    </div>
                                </div>
                                
                                {project.createdAt && (
                                    <div className="flex items-center">
                                        <div className="bg-amber-500/10 rounded-md p-2 mr-3">
                                            <Calendar className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-mono">.createdAt</p>
                                            <p className="font-medium text-white font-mono">
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
                                    <div className="bg-amber-500/10 rounded-md p-2 mr-3">
                                        <Users className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-mono">.positions.length</p>
                                        <p className="font-medium text-white font-mono">
                                            {project.positions.reduce((acc, pos) => acc + pos.quantity, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section with improved typography and spacing */}
                    <div className="px-6 sm:px-8 py-6">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center font-mono">
                                <span className="mr-2">project.description</span>
                                <div className="h-px bg-amber-500/30 flex-grow"></div>
                            </h3>
                            <div className="bg-gray-950/70 p-5 rounded-md border border-gray-800 text-gray-300 leading-relaxed font-mono">
                                {project.description.split('\n').map((paragraph, i) => (
                                    <p key={i} className={i > 0 ? 'mt-4' : ''}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Project Link with enhanced visual */}
                        {project.websiteUrl && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center font-mono">
                                    <span className="mr-2">project.resources</span>
                                    <div className="h-px bg-amber-500/30 flex-grow"></div>
                                </h3>
                                <a
                                    href={project.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-gray-950/70 p-4 rounded-md border border-gray-800 text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
                                >
                                    <div className="bg-amber-500/10 rounded-md p-2 mr-3">
                                        <Globe className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm text-gray-400 font-mono">.websiteUrl</div>
                                        <div className="text-amber-400 font-medium truncate max-w-lg font-mono">
                                            {project.websiteUrl}
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Positions Section with enhanced cards */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center font-mono">
                        <span className="relative inline-block">
                            <span className="relative z-10">project.positions[]</span>
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-500 opacity-20 rounded"></span>
                        </span>
                    </h2>

                    {project.positions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.positions.map((position) => (
                                <div
                                    key={position.id}
                                    className="group bg-gradient-to-br from-gray-900 to-gray-900 rounded-md overflow-hidden shadow-lg border border-gray-800 hover:border-amber-500/30 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                                >
                                    {/* Position visual enhancement with spotlight effect */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="p-6 relative">
                                        {/* Position Header with improved layout */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors font-mono">
                                                    {position.roleName}
                                                </h3>
                                                <span className={`text-xs flex items-center px-2 py-1 rounded-md font-mono
                                                    ${position.quantity > 0 
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                                                    }`}
                                                >
                                                    {position.quantity > 0 
                                                        ? <CheckCircle className="w-3 h-3 mr-1" /> 
                                                        : <XCircle className="w-3 h-3 mr-1" />
                                                    }
                                                    .quantity = {position.quantity}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Position Details with improved visuals */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center text-sm">
                                                <div className="bg-amber-500/10 rounded-md p-1.5 mr-2">
                                                    <Briefcase className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <span className={position.paid ? "text-green-400 font-mono" : "text-gray-300 font-mono"}>
                                                    {position.paid ? ".paid = true" : ".paid = false"}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm">
                                                <div className="bg-amber-500/10 rounded-md p-1.5 mr-2">
                                                    <Shield className="w-4 h-4 text-amber-400" />
                                                </div>
                                                <span className="text-gray-300 font-mono">
                                                    .requiresReview = true
                                                </span>
                                            </div>
                                        </div>

                                        {/* Apply Button with enhanced states */}
                                        <button
                                            onClick={() => handleApply(position.id)}
                                            disabled={position.quantity === 0 || project.creatorName === loggedInUsername}
                                            className={`w-full px-4 py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center font-mono
                                                ${position.quantity === 0 
                                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" 
                                                    : project.creatorName === loggedInUsername
                                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                                        : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black shadow-md hover:shadow-lg border border-transparent"
                                                }`}
                                        >
                                            {position.quantity === 0 
                                                ? <XCircle className="w-4 h-4 mr-2" /> 
                                                : project.creatorName === loggedInUsername
                                                    ? <User className="w-4 h-4 mr-2" />
                                                    : <CheckCircle className="w-4 h-4 mr-2" />
                                            }
                                            {position.quantity === 0 
                                                ? "position.filled" 
                                                : project.creatorName === loggedInUsername
                                                    ? "self.isOwner"
                                                    : "position.apply()"
                                            }
                                            {!(position.quantity === 0 || project.creatorName === loggedInUsername) && (
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-gradient-to-br from-gray-900 to-gray-900 rounded-md border border-gray-800">
                            <div className="inline-block p-6 bg-gray-800/50 rounded-md mb-4">
                                <Users className="h-10 w-10 text-amber-500/50" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-300 mb-2 font-mono">positions.length === 0</h3>
                            <p className="text-gray-400 max-w-md mx-auto font-mono">
                                // no positions are currently available for this project
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Honeycomb decoration (visible on larger screens) with improved styling */}
            <div className="hidden lg:block fixed top-1/4 right-0 opacity-10 pointer-events-none">
                <div className="w-64 h-64 border-2 border-amber-500/20 rounded-full"></div>
            </div>
            <div className="hidden lg:block fixed bottom-1/4 left-0 opacity-10 pointer-events-none">
                <div className="w-48 h-48 border-2 border-amber-500/20 rounded-full"></div>
            </div>

            {/* Background pattern with subtle animation */}
            <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1] animate-pulse"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                    backgroundSize: "112px 200px",
                    animationDuration: "10s"
                }}>
            </div>

            {/* Custom styling for SweetAlert */}
            <style>{`
                .custom-swal-popup {
                    background: #111827 !important;
                    border: 1px solid #2D3748 !important;
                    border-radius: 0.5rem !important;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                .custom-swal-confirm {
                    background: #F59E0B !important;
                    color: black !important;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                .custom-swal-cancel {
                    background: #4B5563 !important;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                .swal2-textarea {
                    background-color: #1F2937 !important;
                    color: white !important;
                    border-color: #374151 !important;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
            `}</style>
        </div>
    );
}