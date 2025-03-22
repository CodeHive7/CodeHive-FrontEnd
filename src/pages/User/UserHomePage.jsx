import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import {
  fetchAllProjects,
  applyForPosition,
  createProject,
  fetchCategories,
} from "../../services/userService/UserService.js";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  X,
  ChevronRight,
  Users,
  MessageSquare,
  Code,
  Grid,
  Layers,
  GitBranch,
  Search,
  Info,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";

export default function UserHomePage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    stage: "",
    websiteUrl: "",
    problemToFix: "",
    question1: "",
    question2: "",
    selectedCategory: "",
    positions: [{ roleName: "", paid: false, quantity: 1 }],
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { logoutHandler } = useAuth();

  useEffect(() => {
    loadProjects();
    loadCategories();
  }, []);

  useEffect(() => {
    if (!projects.length) {
      setFilteredProjects([]);
      return;
    }
    let result = [...projects];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.category.toLowerCase().includes(term)
      );
    }

    if (activeTab !== "all") {
      if (activeTab === "paid") {
        result = result.filter((project) =>
          project.positions.some((pos) => pos.paid)
        );
      } else {
        result = result.filter((project) => project.stage === activeTab);
      }
    }
    setFilteredProjects(result);
  }, [searchTerm, activeTab, projects]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error loading projects", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load projects",
        text: "Please try again later",
        confirmButtonColor: "#EAB308",
      });
    } finally {
      setLoading(false);
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
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
        confirmButtonColor: "#EAB308",
      });
    } catch (error) {
      console.error("Error applying for position", error);
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: "Please try again later",
        confirmButtonColor: "#EAB308",
      });
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return !!newProject.name && !!newProject.description && !!newProject.selectedCategory;
    } else if (currentStep === 2) {
      return !!newProject.stage;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields before continuing.",
        confirmButtonColor: "#EAB308",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateProject = async () => {
    if (!validateCurrentStep()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields before submitting.",
        confirmButtonColor: "#EAB308",
      });
      return;
    }
    if (!newProject.positions.length || !newProject.positions[0].roleName) {
      Swal.fire({
        icon: "warning",
        title: "Missing Positions",
        text: "Please add at least one position to your project.",
        confirmButtonColor: "#EAB308",
      });
      return;
    }
    try {
      Swal.fire({
        title: "Creating your project...",
        text: "This might take a moment",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await createProject(newProject);
      Swal.fire({
        icon: "success",
        title: "Project Created",
        text: "Your project has been created successfully!",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#EAB308",
      });
      setIsModalOpen(false);
      setNewProject({
        name: "",
        description: "",
        stage: "",
        websiteUrl: "",
        problemToFix: "",
        question1: "",
        question2: "",
        selectedCategory: "",
        positions: [{ roleName: "", paid: false, quantity: 1 }],
      });
      setCurrentStep(1);
      loadProjects();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Creating Project",
        text: error.response?.data || "An error occurred while creating the project. Please try again.",
        confirmButtonColor: "#EAB308",
      });
    }
  };

  const toggleDescription = (projectId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Utility functions for stage display
  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case "NOT_STARTED":
        return "bg-blue-600";
      case "IN_DEVELOPMENT":
        return "bg-amber-600";
      case "FINISHED":
        return "bg-green-600";
      case "NEEDS_FIXES":
        return "bg-red-600";
      default:
        return "bg-purple-600";
    }
  };

  const getStageDisplayName = (stage) => {
    switch (stage) {
      case "NOT_STARTED":
        return "Not Started";
      case "IN_DEVELOPMENT":
        return "In Development";
      case "FINISHED":
        return "Completed";
      case "NEEDS_FIXES":
        return "Needs Fixes";
      default:
        return stage || "Ongoing";
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case "NOT_STARTED":
        return <Layers className="w-3 h-3 mr-1" />;
      case "IN_DEVELOPMENT":
        return <GitBranch className="w-3 h-3 mr-1" />;
      case "FINISHED":
        return <Code className="w-3 h-3 mr-1" />;
      case "NEEDS_FIXES":
        return <Grid className="w-3 h-3 mr-1" />;
      default:
        return <Code className="w-3 h-3 mr-1" />;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-center text-white">
              <span className="bg-yellow-500/10 px-3 py-1 rounded">
                Step 1: Basic Information
              </span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  placeholder="Describe your project in detail"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg h-32 focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">
                  Provide a clear description to attract the right developers
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                  value={newProject.selectedCategory}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      selectedCategory: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Website URL <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newProject.websiteUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, websiteUrl: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-center text-white">
              <span className="bg-yellow-500/10 px-3 py-1 rounded">
                Step 2: Project Details
              </span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Stage *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["NOT_STARTED", "IN_DEVELOPMENT", "NEEDS_FIXES", "FINISHED"].map(
                    (stage) => (
                      <div
                        key={stage}
                        onClick={() => setNewProject({ ...newProject, stage })}
                        className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center ${
                          newProject.stage === stage
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        <div className="mb-2">{getStageIcon(stage)}</div>
                        <span className="text-sm font-medium">
                          {getStageDisplayName(stage)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Problem Statement <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  placeholder="What problem does this project solve?"
                  value={newProject.problemToFix}
                  onChange={(e) =>
                    setNewProject({ ...newProject, problemToFix: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg h-24 focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Describing the problem helps potential contributors understand the
                  project's purpose
                </p>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Questions for Applicants <span className="text-gray-500">(optional)</span>
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="Question 1 for applicants"
                    value={newProject.question1}
                    onChange={(e) =>
                      setNewProject({ ...newProject, question1: e.target.value })
                    }
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
                {newProject.question1 && (
                  <div>
                    <input
                      type="text"
                      placeholder="Question 2 for applicants"
                      value={newProject.question2}
                      onChange={(e) =>
                        setNewProject({ ...newProject, question2: e.target.value })
                      }
                      className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                    />
                  </div>
                )}
                <p className="text-gray-400 text-xs">
                  These questions will be shown to developers applying to your project
                </p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-center text-white">
              <span className="bg-yellow-500/10 px-3 py-1 rounded">
                Step 3: Team Positions
              </span>
            </h3>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {newProject.positions.map((position, index) => (
                <div
                  key={index}
                  className="bg-gray-900/80 p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-200">
                      Position {index + 1}
                    </h4>
                    {newProject.positions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPositions = newProject.positions.filter(
                            (_, i) => i !== index
                          );
                          setNewProject({ ...newProject, positions: updatedPositions });
                        }}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center"
                        aria-label="Remove position"
                      >
                        <X className="w-4 h-4 mr-1" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Frontend Developer, UI Designer"
                        value={position.roleName}
                        onChange={(e) => {
                          const updatedPositions = [...newProject.positions];
                          updatedPositions[index].roleName = e.target.value;
                          setNewProject({ ...newProject, positions: updatedPositions });
                        }}
                        className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Number of Spots
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={position.quantity}
                          onChange={(e) => {
                            const updatedPositions = [...newProject.positions];
                            updatedPositions[index].quantity = Math.max(
                              1,
                              parseInt(e.target.value) || 1
                            );
                            setNewProject({ ...newProject, positions: updatedPositions });
                          }}
                          className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 opacity-0">
                          Paid
                        </label>
                        <div
                          onClick={() => {
                            const updatedPositions = [...newProject.positions];
                            updatedPositions[index].paid = !updatedPositions[index].paid;
                            setNewProject({ ...newProject, positions: updatedPositions });
                          }}
                          className={`cursor-pointer px-4 py-3 rounded-lg border flex items-center transition-colors ${
                            position.paid
                              ? "bg-green-900/30 border-green-700 text-green-400"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={position.paid}
                            onChange={() => {}}
                            className="mr-2 accent-yellow-500"
                          />
                          Paid Position
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setNewProject({
                    ...newProject,
                    positions: [
                      ...newProject.positions,
                      { roleName: "", paid: false, quantity: 1 },
                    ],
                  })
                }
                className="w-full py-3 px-4 border border-dashed border-yellow-500/40 rounded-lg bg-yellow-500/5 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 transition-colors flex items-center justify-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Another Position
              </button>
            </div>
            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <div className="flex items-start">
                <Info className="text-blue-400 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-200 text-sm">
                  Add all the positions you need for your project. You can add multiple
                  positions with different roles and specify if they are paid.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white overflow-x-hidden relative">
      {/* Header */}
          <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14]/95 backdrop-blur-sm shadow-md">
      <div className="flex h-14 sm:h-16 items-center justify-between px-2 xs:px-3 sm:px-4 md:px-6 container mx-auto">
        {/* Logo with responsive sizing */}
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white whitespace-nowrap">
          <span className="text-yellow-400">Code</span>Hive
        </h1>
        
        {/* Action buttons with responsive spacing */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
          {/* Create Project Button */}
          <button
            onClick={() => {
              setIsModalOpen(true);
              setCurrentStep(1);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black font-semibold 
                      text-[10px] xs:text-xs sm:text-sm
                      px-1.5 xs:px-2 sm:px-3 md:px-4 
                      py-1 xs:py-1.5 sm:py-2 
                      rounded-md flex items-center 
                      transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Create a new project"
          >
            <PlusCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 xs:mr-1.5 sm:mr-2" />
            <span className="text-[10px] xs:text-xs sm:text-sm">Create Project</span>
          </button>
          
          {/* Chat Button */}
          <Link
            to="/user/messages"
            className="bg-gray-800 hover:bg-gray-700 text-white 
                      text-[10px] xs:text-xs sm:text-sm
                      px-1.5 xs:px-2 sm:px-3 md:px-4 
                      py-1 xs:py-1.5 sm:py-2 
                      rounded-md flex items-center 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Open chat"
          >
            <MessageSquare className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 xs:mr-1.5 sm:mr-2" />
            <span className="text-[10px] xs:text-xs sm:text-sm">Chat</span>
          </Link>
          
          {/* Dashboard Button */}
          <Link
            to="/user"
            className="hover:bg-gray-800 
                      p-1 xs:p-1.5 sm:p-2 
                      rounded-md transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
          </Link>
          
          {/* Logout Button */}
          <button
            onClick={logoutHandler}
            className="hover:bg-gray-800 
                      p-1 xs:p-1.5 sm:p-2 
                      rounded-md transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
          </button>
        </div>
      </div>
    </header>

      {/* Projects Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
          <span className="relative inline-block">
            <span className="relative z-10">Explore Projects</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-500 opacity-20 rounded"></span>
          </span>
        </h2>

        {/* Search & Filter */}
        <div className="bg-[#12141F] border border-gray-800 rounded-lg p-4 mb-8 shadow-md transition-all hover:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search projects, technologies, or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 focus:outline-none transition-all"
                aria-label="Search projects"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Projects" },
                { id: "IN_DEVELOPMENT", label: "In Development" },
                { id: "paid", label: "Paid Opportunities" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  aria-pressed={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#12141F] rounded-lg overflow-hidden shadow-lg border border-gray-800 h-[400px] relative">
                <div className="absolute top-0 right-0 h-6 w-24 bg-gray-800 rounded-bl-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-gray-800 rounded-md w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded-md w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-800 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-800 rounded-md w-2/3"></div>
                  </div>
                  <div className="pt-4">
                    <div className="h-10 bg-gray-800 rounded-md w-full"></div>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-800/10 to-transparent"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 border border-gray-800/50 rounded-xl bg-gray-900/20">
            <div className="inline-block p-6 bg-gray-800/60 rounded-full mb-4 animate-pulse">
              <AlertCircle className="h-12 w-12 text-yellow-400" />
            </div>
            {searchTerm || activeTab !== "all" ? (
              <>
                <p className="text-gray-300 text-xl font-medium">
                  No matching projects found
                </p>
                <p className="text-gray-400 mt-2 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                  }}
                  className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-300 text-xl font-medium">
                  No projects available yet
                </p>
                <p className="text-gray-400 mt-2 max-w-md mx-auto">
                  Be the first to create a project and start collaborating with other developers!
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setCurrentStep(1);
                  }}
                  className="mt-6 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create Your Project
                </button>
              </>
            )}
          </div>
        ) : (
          <div
            className={`project-grid grid gap-6 sm:gap-8 mx-auto ${
              filteredProjects.length === 1
                ? "grid-cols-1 max-w-lg"
                : filteredProjects.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="project-card group bg-gradient-to-br from-[#12141F] to-[#191c2e] rounded-lg overflow-hidden shadow-lg border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:border-yellow-500/30 hover:shadow-xl relative flex flex-col"
              >
                {/* Decorative Elements */}
                <div className="absolute -left-12 -top-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl"></div>
                <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl"></div>

                {/* Stage Badge */}
                <div
                  className={`absolute top-0 right-0 ${getStageBadgeColor(
                    project.stage
                  )} px-3 py-1 text-white text-xs font-bold rounded-bl-lg flex items-center transition-all`}
                >
                  {getStageIcon(project.stage)}
                  {getStageDisplayName(project.stage)}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* Header */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {project.name}
                  </h3>
                  {/* Category */}
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                      {project.category || "Uncategorized"}
                    </span>
                  </p>
                  {/* Description */}
                  <div className="mt-3 text-gray-300 flex-grow">
                    {project.description && (
                      <p className="relative">
                        {project.description.length > 120 && !expandedDescriptions[project.id]
                          ? project.description.substring(0, 120) + "..."
                          : project.description}
                        {project.description.length > 120 && (
                          <button
                            onClick={() => toggleDescription(project.id)}
                            className="text-yellow-400 hover:underline ml-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded"
                          >
                            {expandedDescriptions[project.id] ? "Show less" : "Read more"}
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                  {/* Team Info & Positions */}
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <div className="flex items-center mb-2 text-sm text-gray-400">
                      <Users className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>
                        Team: {project.positions.reduce((acc, pos) => acc + pos.quantity, 0)}{" "}
                        positions
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                      <span className="mr-2">Open Roles</span>
                      <div className="h-px bg-yellow-500/30 flex-grow"></div>
                    </h4>
                    {project.positions.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto pr-1">
                        {project.positions.map((position, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center bg-gray-800/70 border border-gray-700 px-2 py-1 rounded-md text-xs sm:text-sm transition-all hover:bg-gray-700/70 hover:border-yellow-500/50 group mb-1"
                          >
                            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                            <span className="truncate max-w-[80px] sm:max-w-[120px]">
                              {position.roleName}
                            </span>
                            <div className="flex items-center ml-1 px-1 py-0.5 bg-gray-900/50 rounded">
                              <span className="text-gray-300 text-xs">
                                {position.quantity} spots
                              </span>
                            </div>
                            {position.paid && (
                              <span className="ml-1 bg-green-900/60 text-green-300 text-xs px-1.5 py-0.5 rounded">
                                $
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No open positions</p>
                    )}
                  </div>
                  {/* Action Button */}
                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-5 w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black px-6 py-2.5 rounded-md text-base font-semibold transition-all group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#12141F]"
                  >
                    View Details
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating a New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto animate-fadeIn">
          <div
            className="relative bg-[#12141F] w-full max-w-3xl rounded-xl shadow-xl border border-gray-800 max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[#12141F] px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-yellow-400" />
                <span>Create New Project</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`text-xs font-medium ${
                      currentStep >= step ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    Step {step}
                  </span>
                ))}
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-500 h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 z-10 bg-[#12141F] px-6 py-4 border-t border-gray-800 flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  Previous
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  Cancel
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleCreateProject}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Create Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Background Decorative Elements */}
      <div className="hidden md:block absolute top-1/3 -right-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="hidden md:block absolute bottom-1/4 -left-24 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Global Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(234, 179, 8, 0.3);
          border-radius: 20px;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-[shimmer_2s_infinite] {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
