
// filepath: /home/simoacharouaou/CodeHive-FrontEnd/src/pages/User/UserHomePage.jsx
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
        title: "ProjectFetchException",
        text: "Error: API request failed. Check network connection.",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
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
        title: "application.submit()",
        text: "return { status: 200, message: 'Application successfully sent' }",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
      });
    } catch (error) {
      console.error("Error applying for position", error);
      Swal.fire({
        icon: "error",
        title: "ApplicationException",
        text: "Error: Failed to submit application. Retry operation.",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
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
        title: "ValidationError",
        text: "Error: Required fields cannot be null. Check form inputs.",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
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
        title: "ValidationError",
        text: "Error: Required fields cannot be null. Check form inputs.",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
      });
      return;
    }
    if (!newProject.positions.length || !newProject.positions[0].roleName) {
      Swal.fire({
        icon: "warning",
        title: "PositionError",
        text: "Error: positions.length must be > 0 with valid roleName",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
      });
      return;
    }
    try {
      Swal.fire({
        title: "project.create()",
        text: "status: PENDING...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: "#111827",
        color: "#ffffff"
      });
      await createProject(newProject);
      Swal.fire({
        icon: "success",
        title: "project.create()",
        text: "return { status: 201, data: newProject }",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
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
        title: "ProjectCreationException",
        text: error.response?.data || "Error: API request failed with status 500.",
        confirmButtonColor: "#F59E0B",
        background: "#111827",
        color: "#ffffff"
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
        return "NOT_STARTED";
      case "IN_DEVELOPMENT":
        return "IN_DEVELOPMENT";
      case "FINISHED":
        return "COMPLETED";
      case "NEEDS_FIXES":
        return "NEEDS_FIXES";
      default:
        return stage || "ONGOING";
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
            <h3 className="text-xl font-semibold text-center text-white font-mono">
              <span className="bg-amber-500/10 px-3 py-1 rounded">
                project.init()
              </span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                  .name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="project.name = '...'"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                  .description <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-0 left-0 px-3 py-3 text-gray-500 font-mono">/**</div>
                  <textarea
                    placeholder="Describe your project in detail"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                    className="w-full p-3 pl-10 border border-gray-700 bg-gray-800 text-white rounded-md h-32 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                    required
                  />
                  <div className="absolute bottom-0 left-0 px-3 py-3 text-gray-500 font-mono">*/</div>
                </div>
                <p className="text-gray-400 text-xs mt-1 font-mono">
                  // provide a clear description to attract the right developers
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                  .category <span className="text-amber-500">*</span>
                </label>
                <select
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                  value={newProject.selectedCategory}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      selectedCategory: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Categories.select()</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                  .websiteUrl <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newProject.websiteUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, websiteUrl: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-center text-white font-mono">
              <span className="bg-amber-500/10 px-3 py-1 rounded">
                project.configure()
              </span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                  .stage <span className="text-amber-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["NOT_STARTED", "IN_DEVELOPMENT", "NEEDS_FIXES", "FINISHED"].map(
                    (stage) => (
                      <div
                        key={stage}
                        onClick={() => setNewProject({ ...newProject, stage })}
                        className={`p-3 border rounded-md cursor-pointer transition-all flex flex-col items-center ${
                          newProject.stage === stage
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        } font-mono`}
                      >
                        <div className="mb-2">{getStageIcon(stage)}</div>
                        <span className="text-sm font-medium">
                          {stage}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                  .problemToFix <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  placeholder="problem.describe()"
                  value={newProject.problemToFix}
                  onChange={(e) =>
                    setNewProject({ ...newProject, problemToFix: e.target.value })
                  }
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md h-24 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                />
                <p className="text-gray-400 text-xs mt-1 font-mono">
                  // describing the problem helps potential contributors understand the project
                </p>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300 font-mono">
                  .questions[] <span className="text-gray-500">(optional)</span>
                </label>
                <div>
                  <input
                    type="text"
                    placeholder="questions[0] = '...'"
                    value={newProject.question1}
                    onChange={(e) =>
                      setNewProject({ ...newProject, question1: e.target.value })
                    }
                    className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                  />
                </div>
                {newProject.question1 && (
                  <div>
                    <input
                      type="text"
                      placeholder="questions[1] = '...'"
                      value={newProject.question2}
                      onChange={(e) =>
                        setNewProject({ ...newProject, question2: e.target.value })
                      }
                      className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                )}
                <p className="text-gray-400 text-xs font-mono">
                  // these questions will be presented to developers applying to your project
                </p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-center text-white font-mono">
              <span className="bg-amber-500/10 px-3 py-1 rounded">
                project.positions[]
              </span>
            </h3>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {newProject.positions.map((position, index) => (
                <div
                  key={index}
                  className="bg-gray-900/80 p-5 rounded-md border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-200 font-mono">
                      positions[{index}]
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
                        className="text-red-400 hover:text-red-300 text-sm flex items-center font-mono"
                        aria-label="Remove position"
                      >
                        <X className="w-4 h-4 mr-1" /> delete()
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 font-mono flex items-center">
                        .roleName <span className="text-amber-500">*</span>
                        <button
                          type="button"
                          onClick={() => {
                            Swal.fire({
                              title: "What is a Role?",
                              html: `<div class="text-left font-mono">
                                <p class="mb-3">A role position defines the specific developer type you need for your project.</p>
                                <p class="mb-3">Examples:</p>
                                <ul class="list-disc pl-5 space-y-2">
                                  <li><span class="text-amber-400">Frontend Developer</span> - React, Vue, Angular specialists</li>
                                  <li><span class="text-amber-400">Backend Developer</span> - Node.js, Python, Java experts</li>
                                  <li><span class="text-amber-400">UI/UX Designer</span> - For interface and user experience design</li>
                                  <li><span class="text-amber-400">DevOps Engineer</span> - For deployment and infrastructure</li>
                                  <li><span class="text-amber-400">QA Tester</span> - To test and ensure code quality</li>
                                  <li><span class="text-amber-400">Project Manager</span> - To coordinate team efforts</li>
                                </ul>
                                <p class="mt-3 text-sm text-gray-400">// Be specific to attract the right talent to your project</p>
                              </div>`,  
                              confirmButtonText: "Got it!",
                              confirmButtonColor: "#F59E0B",
                              background: "#111827",
                              color: "#ffffff",
                            });
                          }}
                          className="ml-2 bg-gray-800 hover:bg-amber-500/20 rounded-full w-5 h-5 text-sm flex items-center justify-center text-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                          aria-label="Learn more about role position"
                          >
                            ?
                          </button>
                      </label>
                      <input
                        type="text"
                        placeholder="role = '...'"
                        value={position.roleName}
                        onChange={(e) => {
                          const updatedPositions = [...newProject.positions];
                          updatedPositions[index].roleName = e.target.value;
                          setNewProject({ ...newProject, positions: updatedPositions });
                        }}
                        className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                        required
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                          .quantity
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
                          className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 opacity-0 font-mono">
                          .paid
                        </label>
                        <div
                          onClick={() => {
                            const updatedPositions = [...newProject.positions];
                            updatedPositions[index].paid = !updatedPositions[index].paid;
                            setNewProject({ ...newProject, positions: updatedPositions });
                          }}
                          className={`cursor-pointer px-4 py-3 rounded-md border flex items-center transition-colors ${
                            position.paid
                              ? "bg-green-900/30 border-green-700 text-green-400"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                          } font-mono`}
                        >
                          <input
                            type="checkbox"
                            checked={position.paid}
                            onChange={() => {}}
                            className="mr-2 accent-amber-500"
                          />
                          .paid = {position.paid ? "true" : "false"}
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
                className="w-full py-3 px-4 border border-dashed border-amber-500/40 rounded-md bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-colors flex items-center justify-center font-mono"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> positions.push()
              </button>
            </div>
            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
              <div className="flex items-start">
                <Info className="text-blue-400 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-200 text-sm font-mono">
                  // add all the positions you need for your project. you can add multiple
                  // positions with different roles and specify if they are paid.
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
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden relative">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm shadow-md">
        <div className="flex h-14 sm:h-16 items-center justify-between px-2 xs:px-3 sm:px-4 md:px-6 container mx-auto">
          {/* Logo with responsive sizing */}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white whitespace-nowrap font-mono">
            <span className="text-amber-400">Code</span>Hive
          </h1>
          
          {/* Action buttons with responsive spacing */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            {/* Create Project Button */}
            <button
              onClick={() => {
                setIsModalOpen(true);
                setCurrentStep(1);
              }}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold 
                        text-[10px] xs:text-xs sm:text-sm
                        px-1.5 xs:px-2 sm:px-3 md:px-4 
                        py-1 xs:py-1.5 sm:py-2 
                        rounded-md flex items-center 
                        transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              aria-label="Create a new project"
            >
              <PlusCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 xs:mr-1.5 sm:mr-2" />
              <span className="text-[10px] xs:text-xs sm:text-sm">project.create()</span>
            </button>
            
            {/* Chat Button */}
            <Link
              to="/user/messages"
              className="bg-gray-800 hover:bg-gray-700 text-white 
                        text-[10px] xs:text-xs sm:text-sm
                        px-1.5 xs:px-2 sm:px-3 md:px-4 
                        py-1 xs:py-1.5 sm:py-2 
                        rounded-md flex items-center 
                        transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 font-mono"
              aria-label="Open chat"
            >
              <MessageSquare className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 xs:mr-1.5 sm:mr-2" />
              <span className="text-[10px] xs:text-xs sm:text-sm">chat.open()</span>
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
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center font-mono">
          <span className="relative inline-block">
            <span className="relative z-10">projects.explore()</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-500 opacity-20 rounded"></span>
          </span>
        </h2>

        {/* Search & Filter */}
        <div className="bg-gray-900 border border-gray-800 rounded-md p-4 mb-8 shadow-md transition-all hover:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="search(keyword: string)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-md focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:outline-none transition-all font-mono"
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
                { id: "all", label: "projects.all()" },
                { id: "IN_DEVELOPMENT", label: "projects.filter('IN_DEVELOPMENT')" },
                { id: "paid", label: "projects.filter({ paid: true })" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-mono ${
                    activeTab === tab.id
                      ? "bg-amber-500 text-black"
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
              <div key={i} className="bg-gray-900 rounded-md overflow-hidden shadow-lg border border-gray-800 h-[400px] relative">
                <div className="absolute top-0 right-0 h-6 w-24 bg-gray-800 rounded-bl-md"></div>
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
          <div className="text-center py-16 px-4 border border-gray-800/50 rounded-md bg-gray-900/20">
            <div className="inline-block p-6 bg-gray-800/60 rounded-full mb-4 animate-pulse">
              <AlertCircle className="h-12 w-12 text-amber-400" />
            </div>
            {searchTerm || activeTab !== "all" ? (
              <>
                <p className="text-gray-300 text-xl font-medium font-mono">
                  projects.filter(query).length === 0
                </p>
                <p className="text-gray-400 mt-2 max-w-md mx-auto font-mono">
                  // no matching results. try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                  }}
                  className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                >
                  <X className="w-4 h-4 mr-2" />
                  filters.reset()
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-300 text-xl font-medium font-mono">
                  projects.length === 0
                </p>
                <p className="text-gray-400 mt-2 max-w-md mx-auto font-mono">
                  // be the first to create a project and start collaborating with other devs
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setCurrentStep(1);
                  }}
                  className="mt-6 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-md transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  project.create()
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
                className="project-card group bg-gradient-to-br from-gray-900 to-gray-900 rounded-md overflow-hidden shadow-lg border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/30 hover:shadow-xl relative flex flex-col"
              >
                {/* Decorative Elements */}
                <div className="absolute -left-12 -top-12 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>

                {/* Stage Badge */}
                <div
                  className={`absolute top-0 right-0 ${getStageBadgeColor(
                    project.stage
                  )} px-3 py-1 text-white text-xs font-bold rounded-bl-md flex items-center transition-all font-mono`}
                >
                  {getStageIcon(project.stage)}
                  {getStageDisplayName(project.stage)}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* Header */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors font-mono">
                    {project.name}
                  </h3>
                  {/* Category */}
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                      category: "{project.category || "UNCATEGORIZED"}"
                    </span>
                  </p>
                  {/* Description */}
                  <div className="mt-3 text-gray-300 flex-grow">
                    {project.description && (
                      <p className="relative font-mono">
                        {project.description.length > 120 && !expandedDescriptions[project.id]
                          ? project.description.substring(0, 120) + "..."
                          : project.description}
                        {project.description.length > 120 && (
                          <button
                            onClick={() => toggleDescription(project.id)}
                            className="text-amber-400 hover:underline ml-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded font-mono"
                          >
                            {expandedDescriptions[project.id] ? ".collapse()" : ".expand()"}
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                  {/* Team Info & Positions */}
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <div className="flex items-center mb-2 text-sm text-gray-400 font-mono">
                      <Users className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>
                        positions.length = {project.positions.reduce((acc, pos) => acc + pos.quantity, 0)}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center font-mono">
                      <span className="mr-2">positions.filter(open: true)</span>
                      <div className="h-px bg-amber-500/30 flex-grow"></div>
                    </h4>
                    {project.positions.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {project.positions.map((position, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center bg-gray-800/70 border border-gray-700 px-2 py-1 rounded-md text-xs sm:text-sm transition-all hover:bg-gray-700/70 hover:border-amber-500/50 group mb-1 font-mono"
                          >
                            <div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div>
                            <span className="truncate max-w-[80px] sm:max-w-[120px]">
                              {position.roleName}
                            </span>
                            <div className="flex items-center ml-1 px-1 py-0.5 bg-gray-900/50 rounded">
                              <span className="text-gray-300 text-xs">
                                count: {position.quantity}
                              </span>
                            </div>
                            {position.paid && (
                              <span className="ml-1 bg-green-900/60 text-green-300 text-xs px-1.5 py-0.5 rounded">
                                paid=true
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm font-mono">
                        {/* Empty array indicator */}
                        positions.length === 0
                      </p>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-5 w-full inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black px-6 py-2.5 rounded-md text-base font-semibold transition-all group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-950 font-mono"
                  >
                    project.view(id: {String(project.id).substring(0, 4)}...)
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
            className="relative bg-gray-950 w-full max-w-3xl rounded-xl shadow-xl border border-gray-800 max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gray-950 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center font-mono">
                <PlusCircle className="w-5 h-5 mr-2 text-amber-400" />
                <span>new Project();</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4">
              <div className="flex justify-between mb-2 font-mono">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`text-xs font-medium ${
                      currentStep >= step ? "text-amber-400" : "text-gray-500"
                    }`}
                  >
                    step_{step}()
                  </span>
                ))}
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 z-10 bg-gray-950 px-6 py-4 border-t border-gray-800 flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 font-mono"
                >
                  step.prev()
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 font-mono"
                >
                  modal.close()
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                >
                  step.next()
                </button>
              ) : (
                <button
                  onClick={handleCreateProject}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                >
                  project.save()
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Background Decorative Elements */}
      <div className="hidden md:block absolute top-1/3 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="hidden md:block absolute bottom-1/4 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

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
          background-color: rgba(245, 158, 11, 0.3);
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