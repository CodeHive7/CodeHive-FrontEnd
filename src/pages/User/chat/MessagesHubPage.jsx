import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Users, 
    Loader2, 
    MessageSquare, 
    ChevronRight,
    Clock,
    Search,
    Home,
    ArrowLeft,
    Code,
    MessageCircle,
    Activity,
    Sparkles,
    X,
    Terminal
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchMyProjects, fetchAppliedProjects } from "../../../services/userService/UserService.js";

export default function MessagesHubPage() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const navigate = useNavigate();
    const animationRef = useRef(null);

    // Animation effect
    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.classList.add('animate-fade-in');
        }
    }, []);

    useEffect(() => {
        const fetchAccessibleProjects = async () => {
            try {
                setLoading(true);
                
                // Get projects where user is creator
                const createdProjects = await fetchMyProjects();
                
                // Get projects where user has applied/accepted
                const appliedProjectsResponse = await fetchAppliedProjects();
                
                // Filter only accepted projects from applied ones
                const acceptedProjects = appliedProjectsResponse.filter(
                    project => project.applicationStatus === "ACCEPTED"
                );
                
                // Combine projects and ensure uniqueness by ID
                const projectMap = new Map();
                
                // Add created projects to map
                createdProjects.forEach(project => {
                    if (project && project.id) {
                        projectMap.set(project.id.toString(), {
                            ...project,
                            isCreator: true
                        });
                    }
                });
                
                // Add accepted projects to map (will overwrite duplicates)
                acceptedProjects.forEach(project => {
                    if (project && project.id) {
                        // Preserve isCreator flag if it exists
                        const existing = projectMap.get(project.id.toString());
                        projectMap.set(project.id.toString(), {
                            ...project,
                            isCreator: existing?.isCreator || false
                        });
                    }
                });
                
                // Convert map values back to array
                const uniqueProjects = Array.from(projectMap.values());
                
                setProjects(uniqueProjects);
                setFilteredProjects(uniqueProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                Swal.fire({
                    icon: "error",
                    title: "Connection Error",
                    text: "Unable to load your projects. Please check your internet connection and try again.",
                    confirmButtonColor: "#F59E0B",
                    background: "#111827",
                    color: "#ffffff"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAccessibleProjects();
    }, []);

    // Filter projects based on search query and category
    useEffect(() => {
        let filtered = projects;
        
        // Filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(project => 
                project.name && project.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Filter by category
        if (selectedCategory !== "all") {
            if (selectedCategory === "created") {
                filtered = filtered.filter(project => project.isCreator);
            } else if (selectedCategory === "joined") {
                filtered = filtered.filter(project => !project.isCreator);
            }
        }
        
        setFilteredProjects(filtered);
    }, [searchQuery, selectedCategory, projects]);

    // Get stage badge color
    const getStageBadgeColor = (stage) => {
        switch(stage) {
            case "NOT_STARTED": return "bg-blue-600";
            case "IN_DEVELOPMENT": return "bg-amber-600";
            case "FINISHED": return "bg-green-600";
            case "NEEDS_FIXES": return "bg-red-600";
            default: return "bg-purple-600";
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
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => navigate("/userHome")}
                            className="p-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                        >
                            <ArrowLeft className="w-5 h-5 text-amber-400" />
                        </button>
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <MessageSquare className="mr-2 h-6 w-6 text-amber-400" />
                            <span className="text-amber-400">Project</span> Messages
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/user"
                            className="flex items-center text-sm text-gray-300 hover:text-amber-400 transition-colors"
                        >
                            <Home className="w-4 h-4 mr-1" />
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8" ref={animationRef}>
                {/* Interactive Header with Animation */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-amber-400">Project </span>
                        <span className="text-white">Communication</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Effective communication is the backbone of successful projects.
                        <br />
                        Select a project below to chat with your team members.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gray-900 p-4 rounded-md border border-gray-800">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-4 py-2 pl-10 text-white focus:outline-none focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3 py-2 rounded-md text-sm flex items-center ${
                                selectedCategory === "all" 
                                    ? "bg-amber-500 text-black font-medium" 
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <Activity className="w-4 h-4 mr-1" />
                            All Projects
                        </button>
                        <button 
                            onClick={() => setSelectedCategory("created")}
                            className={`px-3 py-2 rounded-md text-sm flex items-center ${
                                selectedCategory === "created" 
                                    ? "bg-amber-500 text-black font-medium" 
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <Sparkles className="w-4 h-4 mr-1" />
                            My Projects
                        </button>
                        <button 
                            onClick={() => setSelectedCategory("joined")}
                            className={`px-3 py-2 rounded-md text-sm flex items-center ${
                                selectedCategory === "joined" 
                                    ? "bg-amber-500 text-black font-medium" 
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <Code className="w-4 h-4 mr-1" />
                            Joined Projects
                        </button>
                    </div>
                </div>

                {/* Projects List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Terminal className="h-6 w-6 text-amber-500" />
                            </div>
                        </div>
                        <p className="text-gray-400 mt-4">Loading your messages <span className="animate-pulse">...</span></p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/30 rounded-md border border-gray-800">
                        <div className="inline-block p-8 bg-gray-800/50 rounded-full mb-4">
                            <MessageCircle className="h-12 w-12 text-amber-500" />
                        </div>
                        
                        {searchQuery || selectedCategory !== "all" ? (
                            <>
                                <p className="text-gray-300 text-xl">No matching projects found</p>
                                <p className="text-gray-400 mt-2">No conversations match your current search or filters</p>
                                <button 
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                    }}
                                    className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-amber-400 flex items-center mx-auto"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear Filters
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-300 text-xl">No conversations yet</p>
                                <p className="text-gray-400 mt-2">Join or create a project to start collaborating</p>
                                <Link 
                                    to="/user/my-projects" 
                                    className="mt-4 inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-md"
                                >
                                    View My Projects
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project, index) => (
                            <Link
                                key={project.id ? project.id.toString() : `project-${index}`}
                                to={`/user/projects/${project.id}/chat`}
                                className="group bg-gray-900 rounded-md overflow-hidden shadow-lg border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/30 flex flex-col h-full"
                            >
                                <div className="p-6 relative flex-grow">
                                    {/* Decorative Elements */}
                                    <div className="absolute -left-12 -top-12 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                                    <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                                    
                                    {/* Creator badge */}
                                    {project.isCreator && (
                                        <div className="absolute top-0 left-0 bg-amber-500 px-3 py-1 text-black text-xs font-bold rounded-br-md">
                                            Owner
                                        </div>
                                    )}
                                    
                                    {/* Stage badge */}
                                    {project.stage && (
                                        <div className={`absolute top-0 right-0 ${getStageBadgeColor(project.stage)} px-3 py-1 text-white text-xs font-bold rounded-bl-md flex items-center`}>
                                            {getStageDisplayName(project.stage)}
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        <h3 className="text-xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                                            {project.name || "Unnamed Project"}
                                        </h3>
                                        
                                        <div className="flex items-center mt-2 text-sm">
                                            <span className="bg-gray-800/70 px-2 py-1 rounded text-xs text-gray-300 mr-2">
                                                {project.category || "Uncategorized"}
                                            </span>
                                            
                                            <div className="flex items-center text-gray-400">
                                                <Users className="w-4 h-4 mr-1" />
                                                <span>Team Space</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-400 text-sm mt-3 line-clamp-2 min-h-[40px]">
                                            {project.description || "No description available"}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center mt-4 text-xs text-gray-400">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        <span>
                                            {project.createdAt 
                                                ? `Created: ${new Date(project.createdAt).toLocaleDateString()}`
                                                : "Recently created"}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Call-to-action Footer */}
                                <div className="mt-auto p-4 border-t border-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <MessageCircle className="h-5 w-5 text-amber-500 mr-2" />
                                            <span className="text-sm text-gray-300">Open Chat</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                {/* Help text */}
                {!loading && filteredProjects.length > 0 && (
                    <div className="mt-10 text-center text-gray-400 text-sm bg-gray-900/30 p-4 rounded-md border border-gray-800/50">
                        <p>Click on any project card to open the team communication channel</p>
                        <p className="mt-1">Only accepted team members can access project chats</p>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <footer className="mt-auto py-4 text-center text-gray-500 text-sm border-t border-gray-800 bg-gray-950">
                <p>CodeHive | Building better projects together</p>
            </footer>
            
            {/* Subtle code pattern background */}
            <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                    backgroundSize: "112px 200px"
                }}>
            </div>
            
            {/* Global Keyframe Animations */}
            <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                .animate-fade-in {
                  animation: fadeIn 0.5s ease-out;
                }
                .animate-pulse {
                  animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
}