import { useState, useEffect } from "react";
                                  import { CheckCircle, Clock, XCircle, User, ArrowRight, Loader2, Users, Building } from "lucide-react";
                                  import { Link } from "react-router-dom";
                                  import Swal from "sweetalert2";
                                  import { fetchApplicantsForProjects, updateApplicationStatus } from "../../../services/userService/UserService.js";

                                  export default function ProjectApplicantsPage() {
                                      const [projectsWithApplicants, setProjectsWithApplicants] = useState({});
                                      const [loading, setLoading] = useState(true);

                                      useEffect(() => {
                                          loadApplicants();
                                      }, []);

                                      const loadApplicants = async () => {
                                          try {
                                              const data = await fetchApplicantsForProjects();
                                              const groupedProjects = {};

                                              data.forEach((applicant) => {
                                                  if (!groupedProjects[applicant.projectName]) {
                                                      groupedProjects[applicant.projectName] = [];
                                                  }
                                                  groupedProjects[applicant.projectName].push(applicant);
                                              });

                                              setProjectsWithApplicants(groupedProjects);
                                          } catch (error) {
                                              console.error("Error loading applicants", error);
                                          } finally {
                                              setLoading(false);
                                          }
                                      };

                                      const handleApplicationAction = async (projectId, applicationId, accept) => {
                                          if (!projectId || !applicationId) {
                                              Swal.fire({
                                                  icon: "error",
                                                  title: "Error",
                                                  text: "Project ID or Application ID is missing. Please try again.",
                                                  background: "#1C1F2E",
                                                  color: "#ffffff"
                                              });
                                              return;
                                          }
                                          let feedback = "";
                                          if (!accept) {
                                              const { value } = await Swal.fire({
                                                  title: "Provide Rejection Feedback",
                                                  input: "text",
                                                  inputLabel: "Why are you rejecting this applicant?",
                                                  inputPlaceholder: "Optional feedback...",
                                                  showCancelButton: true,
                                                  confirmButtonText: "Submit",
                                                  cancelButtonText: "Skip",
                                                  background: "#1C1F2E",
                                                  color: "#ffffff",
                                                  confirmButtonColor: "#EAB308",
                                                  cancelButtonColor: "#4B5563"
                                              });
                                              feedback = value || "";
                                          }
                                          try {
                                              await updateApplicationStatus(projectId, [applicationId], accept, feedback);
                                              Swal.fire({
                                                  icon: "success",
                                                  title: `Application ${accept ? "Accepted" : "Rejected"}`,
                                                  text: `The application has been ${accept ? "accepted" : "rejected"} successfully.`,
                                                  timer: 2000,
                                                  showConfirmButton: false,
                                                  background: "#1C1F2E",
                                                  color: "#ffffff"
                                              });

                                              loadApplicants();
                                          } catch (error) {
                                              Swal.fire({
                                                  icon: "error",
                                                  title: "Action Failed",
                                                  text: "An error occurred while updating the application status.",
                                                  background: "#1C1F2E",
                                                  color: "#ffffff"
                                              });
                                          }
                                      };

                                      if (loading) {
                                          return (
                                              <div className="flex flex-col items-center justify-center h-64">
                                                  <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                                                  <p className="text-gray-400">Loading applicants...</p>
                                              </div>
                                          );
                                      }

                                      return (
                                          <div className="space-y-6">
                                              <h2 className="text-3xl font-bold text-white mb-6">🐝 Project Applicants</h2>

                                              <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                                                  <div className="flex flex-row items-center justify-between p-6 pb-2">
                                                      <h3 className="text-sm font-medium text-gray-400">People Interested in Your Projects</h3>
                                                      <Users className="h-5 w-5 text-yellow-400" />
                                                  </div>

                                                  <div className="p-6 pt-0">
                                                      {Object.keys(projectsWithApplicants).length === 0 ? (
                                                          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-yellow-500/20 rounded-lg">
                                                              <div className="bg-yellow-500/10 p-4 rounded-full mb-3">
                                                                  <Building className="w-10 h-10 text-yellow-500/70" />
                                                              </div>
                                                              <p className="text-gray-400 text-lg">No applicants for your projects yet</p>
                                                              <p className="text-gray-500 text-sm mt-1">When people apply to your projects, they will appear here</p>
                                                          </div>
                                                      ) : (
                                                          <div className="space-y-8 mt-6">
                                                              {Object.entries(projectsWithApplicants).map(([projectName, applicants]) => (
                                                                  <div key={projectName} className="mb-8">
                                                                      <div className="flex items-center gap-2 mb-4">
                                                                          <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
                                                                          <h3 className="text-xl font-semibold text-white">
                                                                              {projectName}
                                                                          </h3>
                                                                          <span className="ml-auto text-xs text-gray-400 bg-yellow-500/10 px-2 py-1 rounded">
                                                                              {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
                                                                          </span>
                                                                      </div>

                                                                      <div className="grid md:grid-cols-2 gap-6">
                                                                          {applicants.map((applicant) => (
                                                                              <div
                                                                                  key={applicant.applicantUsername}
                                                                                  className="bg-[#181A28] p-6 rounded-lg border border-yellow-500/30 hover:border-yellow-500 transition-all"
                                                                              >
                                                                                  <div className="flex justify-between items-center mb-3">
                                                                                      <div className="flex items-center gap-3">
                                                                                          <div className="bg-yellow-500/10 rounded-full p-2">
                                                                                              <User className="text-yellow-500 w-5 h-5" />
                                                                                          </div>
                                                                                          <div>
                                                                                              <h4 className="text-lg font-semibold text-white">{applicant.applicantName}</h4>
                                                                                              <p className="text-gray-400 text-sm">@{applicant.applicantUsername}</p>
                                                                                          </div>
                                                                                      </div>

                                                                                      {/* Application Status */}
                                                                                      <div>
                                                                                          {applicant.applicationStatus === "ACCEPTED" && (
                                                                                              <span className="flex items-center text-green-400 text-sm bg-green-900/20 px-2 py-1 rounded-lg border border-green-600/30">
                                                                                                  <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                                                                                              </span>
                                                                                          )}
                                                                                          {applicant.applicationStatus === "PENDING" && (
                                                                                              <span className="flex items-center text-yellow-400 text-sm bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-600/30">
                                                                                                  <Clock className="w-4 h-4 mr-1" /> Pending
                                                                                              </span>
                                                                                          )}
                                                                                          {applicant.applicationStatus === "REJECTED" && (
                                                                                              <span className="flex items-center text-red-400 text-sm bg-red-900/20 px-2 py-1 rounded-lg border border-red-600/30">
                                                                                                  <XCircle className="w-4 h-4 mr-1" /> Rejected
                                                                                              </span>
                                                                                          )}
                                                                                      </div>
                                                                                  </div>

                                                                                  {/* Role Information */}
                                                                                  <div className="p-3 bg-black/30 rounded-md mb-4">
                                                                                      <p className="text-gray-300 text-sm">
                                                                                          <span className="text-yellow-400 font-medium">Applied Role:</span> {applicant.positionName}
                                                                                      </p>
                                                                                  </div>

                                                                                  {/* Action Buttons */}
                                                                                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-yellow-500/20">
                                                                                      <Link
                                                                                          to={`/user/profile/view/${applicant.applicantUsername}`}
                                                                                          className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition font-medium"
                                                                                      >
                                                                                          View Profile <ArrowRight className="w-4 h-4" />
                                                                                      </Link>

                                                                                      {/* Accept & Reject Buttons */}
                                                                                      {applicant.applicationStatus === "PENDING" && (
                                                                                          <div className="flex gap-2">
                                                                                              <button
                                                                                                  onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, true)}
                                                                                                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                                                                              >
                                                                                                  <CheckCircle className="w-4 h-4" /> Accept
                                                                                              </button>
                                                                                              <button
                                                                                                  onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, false)}
                                                                                                  className="bg-[#12141F] border border-yellow-500/50 hover:border-yellow-500 text-yellow-400 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                                                                              >
                                                                                                  <XCircle className="w-4 h-4" /> Reject
                                                                                              </button>
                                                                                          </div>
                                                                                      )}
                                                                                  </div>
                                                                              </div>
                                                                          ))}
                                                                      </div>
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      )}
                                                  </div>
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