import { useState, useEffect } from "react";
import { FolderKanban, CheckCircle, XCircle, Clock, PlusCircle, ArrowRight, Loader2, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMyProjects, createProject, fetchCategories } from "../../../services/userService/UserService.js";
import Swal from "sweetalert2";

export default function MyProjectsPage() {
   const [projects, setProjects] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [categories, setCategories] = useState([]);
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

   useEffect(() => {
       loadProjects();
       loadCategories();
   }, []);

   const loadProjects = async () => {
       try {
           const data = await fetchMyProjects();
           setProjects(data);
       } catch (error) {
           console.error("Error loading projects", error);
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

   const handleCreateProject = async () => {
       if (!newProject.name || !newProject.description || !newProject.selectedCategory) {
           Swal.fire({
               icon: "warning",
               title: "Missing Fields",
               text: "Please fill in all required fields before submitting.",
           });
           return;
       }
       try {
           await createProject(newProject);
           Swal.fire({
               icon: "success",
               title: "Hive Created! 🏗️",
               text: "Your project hive has been built successfully!",
               timer: 2000,
               showConfirmButton: false,
           });
           setIsModalOpen(false);
           loadProjects();
       } catch (error) {
           Swal.fire({
               icon: "error",
               title: "Error Creating Project",
               text: error.response?.data || "An error occurred while creating the project. Please try again later.",
           });
       }
   };

   return (
       <div className="space-y-6">
           <div className="flex justify-between items-center mb-6">
               <h2 className="text-3xl font-bold text-yellow-400">🐝 My Projects</h2>
               <button
                   onClick={() => setIsModalOpen(true)}
                   className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors flex items-center gap-2"
               >
                   <PlusCircle className="w-5 h-5" /> Build a Hive
               </button>
           </div>

           {/* My Projects Panel */}
           <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
               <div className="flex flex-row items-center justify-between p-6 pb-2">
                   <h3 className="text-sm font-medium text-gray-400">Projects I've Created</h3>
                   <FolderKanban className="h-5 w-5 text-yellow-400" />
               </div>

               <div className="p-6 pt-0">
                   {loading ? (
                       <div className="flex flex-col items-center justify-center py-16">
                           <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                           <p className="text-gray-400">Loading your projects...</p>
                       </div>
                   ) : projects.length === 0 ? (
                       <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-yellow-500/20 rounded-lg">
                           <div className="bg-yellow-500/10 p-4 rounded-full mb-3">
                               <PlusCircle className="w-10 h-10 text-yellow-500/70" />
                           </div>
                           <p className="text-gray-400 text-lg">You haven't created any projects yet</p>
                           <p className="text-gray-500 text-sm mt-1">Share your ideas with the community</p>
                           <button
                               onClick={() => setIsModalOpen(true)}
                               className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors flex items-center gap-2"
                           >
                               <PlusCircle className="w-4 h-4" /> Create New Project
                           </button>
                       </div>
                   ) : (
                       <div className="grid md:grid-cols-2 gap-6">
                           {projects.map((project) => (
                               <div
                                   key={project.id}
                                   className="bg-[#181A28] p-6 rounded-lg shadow-md border border-yellow-500/50 hover:border-yellow-500 transition-all hover:shadow-lg"
                               >
                                   {/* Project Header */}
                                   <div className="border-b border-yellow-500/30 pb-3 mb-4 flex justify-between items-center">
                                       <h3 className="text-xl font-bold text-yellow-400">{project.name}</h3>
                                       <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                                           Project #{project.id}
                                       </span>
                                   </div>

                                   {/* Project Description */}
                                   <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                                       {project.description}
                                   </p>

                                   {/* Project Details */}
                                   <div className="space-y-2 text-sm">
                                       <div className="flex items-center justify-between">
                                           <span className="text-gray-400">Category:</span>
                                           <span className="font-medium text-white">{project.category || "Uncategorized"}</span>
                                       </div>
                                       <div className="flex items-center justify-between">
                                           <span className="text-gray-400">Status:</span>
                                           <span className="font-medium">
                                               {project.status === "ACCEPTED" && (
                                                   <span className="flex items-center text-green-500">
                                                       <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                                                   </span>
                                               )}
                                               {project.status === "PENDING" && (
                                                   <span className="flex items-center text-yellow-500">
                                                       <Clock className="w-4 h-4 mr-1" /> Pending
                                                   </span>
                                               )}
                                               {project.status === "REJECTED" && (
                                                   <span className="flex items-center text-red-500">
                                                       <XCircle className="w-4 h-4 mr-1" /> Rejected
                                                   </span>
                                               )}
                                           </span>
                                       </div>
                                   </div>

                                   {/* Footer */}
                                   <div className="mt-5 flex items-center justify-end pt-3 border-t border-yellow-500/30">
                                       <Link
                                           to={`/projects/${project.id}`}
                                           className="flex items-center bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                       >
                                           View Details <ChevronRight className="w-4 h-4 ml-1" />
                                       </Link>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
               </div>
           </div>

           {/* Create Project Button (when projects exist) */}
           {!loading && projects.length > 0 && (
               <div className="flex justify-center mt-6">
                   <button
                       onClick={() => setIsModalOpen(true)}
                       className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-full transition-colors flex items-center gap-2 transform hover:scale-105"
                   >
                       <PlusCircle className="w-5 h-5" /> Create New Project
                   </button>
               </div>
           )}

           {/* Create Project Modal */}
           {isModalOpen && (
               <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                   <div className="relative bg-[#1C1F2E] w-full max-w-4xl h-[80vh] overflow-y-auto rounded-lg shadow-lg border border-yellow-500 p-8">
                       <button
                           onClick={() => setIsModalOpen(false)}
                           className="absolute top-5 right-5 text-gray-400 hover:text-white"
                       >
                           <X className="w-8 h-8" />
                       </button>
                       <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">🐝 Build Your Hive</h2>
                       <div className="space-y-4">
                           <input
                               type="text"
                               placeholder="Hive Name"
                               value={newProject.name}
                               onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                               className="w-full p-3 border bg-gray-800 text-white rounded border-yellow-500 focus:border-yellow-400 focus:ring-0"
                           />
                           <textarea
                               placeholder="Describe your Hive..."
                               value={newProject.description}
                               onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                               className="w-full p-3 border bg-gray-800 text-white rounded h-24 border-yellow-500 focus:border-yellow-400 focus:ring-0"
                           />
                           <select
                               className="w-full p-3 border bg-gray-800 text-white rounded border-yellow-500 focus:border-yellow-400 focus:ring-0"
                               value={newProject.stage}
                               onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                           >
                               <option value="">Select Stage</option>
                               <option value="NOT_STARTED">Not Started</option>
                               <option value="IN_DEVELOPMENT">In Development</option>
                               <option value="FINISHED">Finished</option>
                               <option value="NEEDS_FIXES">Needs Fixes</option>
                           </select>
                           <input
                               type="text"
                               placeholder="Website URL (optional)"
                               value={newProject.websiteUrl}
                               onChange={(e) => setNewProject({ ...newProject, websiteUrl: e.target.value })}
                               className="w-full p-3 border bg-gray-800 text-white rounded border-yellow-500 focus:border-yellow-400 focus:ring-0"
                           />
                           <textarea
                               placeholder="What problem does this project solve?"
                               value={newProject.problemToFix}
                               onChange={(e) => setNewProject({ ...newProject, problemToFix: e.target.value })}
                               className="w-full p-3 border bg-gray-800 text-white rounded h-24 border-yellow-500 focus:border-yellow-400 focus:ring-0"
                           />
                           <h3 className="text-white font-semibold text-lg mb-3">Optional Questions for Applicants</h3>
                           <input
                               type="text"
                               placeholder="Question 1 for applicants (Optional)"
                               value={newProject.question1}
                               onChange={(e) => setNewProject({ ...newProject, question1: e.target.value })}
                               className="w-full p-3 border bg-gray-800 text-white rounded border-yellow-500 focus:border-yellow-400 focus:ring-0"
                           />
                           {newProject.question1 && (
                               <input
                                   type="text"
                                   placeholder="Question 2 for applicants (Optional)"
                                   value={newProject.question2}
                                   onChange={(e) => setNewProject({ ...newProject, question2: e.target.value })}
                                   className="w-full p-3 border bg-gray-800 text-white rounded border-yellow-500 focus:border-yellow-400 focus:ring-0"
                               />
                           )}
                           <select
                               className="w-full p-3 border bg-gray-800 text-white rounded border-yellow-500 focus:border-yellow-400 focus:ring-0"
                               value={newProject.selectedCategory}
                               onChange={(e) => setNewProject({ ...newProject, selectedCategory: e.target.value })}
                           >
                               <option value="">Select Category</option>
                               {categories.map((category) => (
                                   <option key={category.id} value={category.name}>
                                       {category.name}
                                   </option>
                               ))}
                           </select>
                           <h3 className="text-white font-semibold text-lg mb-3">Project Positions</h3>
                           {newProject.positions.map((position, index) => (
                               <div key={index} className="bg-gray-900 p-4 rounded-md mb-3 border border-yellow-500/30">
                                   <input
                                       type="text"
                                       placeholder="Role Name"
                                       value={position.roleName}
                                       onChange={(e) => {
                                           const updatedPositions = [...newProject.positions];
                                           updatedPositions[index].roleName = e.target.value;
                                           setNewProject({ ...newProject, positions: updatedPositions });
                                       }}
                                       className="w-full p-2 mb-2 border bg-gray-800 text-white rounded border-yellow-500/50 focus:border-yellow-400 focus:ring-0"
                                   />
                                   <label className="flex items-center text-white text-sm">
                                       <input
                                           type="checkbox"
                                           checked={position.paid}
                                           onChange={(e) => {
                                               const updatedPositions = [...newProject.positions];
                                               updatedPositions[index].paid = e.target.checked;
                                               setNewProject({ ...newProject, positions: updatedPositions });
                                           }}
                                           className="mr-2"
                                       />
                                       Paid Position
                                   </label>
                                   <input
                                       type="number"
                                       placeholder="Quantity"
                                       value={position.quantity}
                                       onChange={(e) => {
                                           const updatedPositions = [...newProject.positions];
                                           updatedPositions[index].quantity = e.target.value;
                                           setNewProject({ ...newProject, positions: updatedPositions });
                                       }}
                                       className="w-full p-2 mt-2 border bg-gray-800 text-white rounded border-yellow-500/50 focus:border-yellow-400 focus:ring-0"
                                   />
                                   <button
                                       onClick={() => {
                                           const updatedPositions = newProject.positions.filter((_, i) => i !== index);
                                           setNewProject({ ...newProject, positions: updatedPositions });
                                       }}
                                       className="text-red-500 mt-2 hover:text-red-700 text-sm flex items-center"
                                   >
                                       <X className="w-4 h-4 mr-1" /> Remove Position
                                   </button>
                               </div>
                           ))}
                           <button
                               onClick={() =>
                                   setNewProject({
                                       ...newProject,
                                       positions: [...newProject.positions, { roleName: "", paid: false, quantity: 1 }],
                                   })
                               }
                               className="text-yellow-400 hover:text-yellow-300 mt-2 text-sm flex items-center"
                           >
                               <PlusCircle className="w-4 h-4 mr-1" /> Add Position
                           </button>
                       </div>
                       <div className="mt-6 text-center">
                           <button
                               className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded text-lg w-full transition transform hover:scale-105 font-bold"
                               onClick={handleCreateProject}
                           >
                               Create Hive
                           </button>
                       </div>
                   </div>
               </div>
           )}

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