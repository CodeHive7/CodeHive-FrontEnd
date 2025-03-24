import { useState, useEffect, useRef } from "react";
import {
  getUserProfile,
  updateUserProfile,
  getAllSkills,
  addSkillToUser,
  removeSkillFromUser,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation
} from "../../../services/userService/UserService.js";
import {
  Pencil,
  Check,
  X,
  Camera,
  User,
  Loader2,
  MapPin,
  Phone,
  Globe,
  Mail,
  Plus,
  Tag,
  Calendar,
  Briefcase,
  Building
} from "lucide-react";
import { format } from "date-fns/fp";
import Swal from "sweetalert2";

export default function ProfilePage() {
  // Default objects for new entries
  const defaultEducation = { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "", currentlyStudying: false };
  const defaultExperience = { title: "", company: "", location: "", startDate: "", endDate: "", description: "", currentlyWorking: false, employmentType: "" };

  // Main state variables
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    avatar: "https://i.pravatar.cc/150?img=3",
    fullName: "",
    email: "",
    username: "",
    bio: "",
    location: "",
    phoneNumber: "",
    website: "",
    educations: [],
    experiences: [],
    skills: []
  });
  const [tempData, setTempData] = useState({ ...userData });

  // Skills management
  const [allSkills, setAllSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillsContainerRef = useRef(null);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Load all available skills when editing
  useEffect(() => {
    if (isEditing) {
      fetchAllSkills();
    }
  }, [isEditing]);

  // Filter skills for autocomplete when skillInput changes
  useEffect(() => {
    if (skillInput.trim() !== "") {
      const filtered = allSkills.filter(
        (skill) =>
          skill?.name?.toLowerCase().includes(skillInput.toLowerCase()) &&
          !tempData.skills.some(
            (userSkill) => userSkill?.name?.toLowerCase() === skill.name.toLowerCase()
          )
      );
      setFilteredSkills(filtered);
      setShowSkillDropdown(true);
    } else {
      setShowSkillDropdown(false);
    }
  }, [skillInput, allSkills, tempData.skills]);

  // Close skills dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsContainerRef.current && !skillsContainerRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // API calls
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      const profile = {
        ...data,
        avatar: data.avatar || "https://i.pravatar.cc/150?img=3",
        educations: data.educations || [],
        experiences: data.experiences || [],
        skills: data.skills || []
      };
      setUserData(profile);
      setTempData(profile);
    } catch (error) {
      console.error("Error fetching user profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const skills = await getAllSkills();
      setAllSkills(skills);
    } catch (error) {
      console.error("Error fetching skills", error);
    }
  };

  // Input change handler for basic fields
  const handleChange = (e) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  // Save all changes with one button
  const handleSave = async () => {
    try {
      Swal.fire({
        title: "Saving...",
        text: "Updating your profile",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => Swal.showLoading()
      });

      // Update basic user info
      await updateUserProfile({
        fullName: tempData.fullName,
        email: tempData.email,
        username: tempData.username,
        bio: tempData.bio,
        location: tempData.location,
        phoneNumber: tempData.phoneNumber,
        website: tempData.website,
        skills: tempData.skills
      });

      // Process Experiences
      for (const exp of tempData.experiences.filter(exp => !exp.id)) {
        if (!exp.title || !exp.company || !exp.startDate) {
          console.warn("Skipping experience due to missing required fields", exp);
          continue;
        }

        const formattedExp = {
          ...exp,
          startDate: exp.startDate ? exp.startDate.split('T')[0] : null,
          endDate: exp.endDate ? exp.endDate.split('T')[0] : null
        }

        const createdExp = await createExperience(formattedExp);
        const expIndex = tempData.experiences.findIndex(e =>
          e.title === exp.title && e.company === exp.company && !e.id);
          if (expIndex !== -1) {
           tempData.experiences[expIndex].id = createdExp.id;
          }
      }
      
      const freshProfile = await getUserProfile();
      const expIdsInUI = tempData.experiences.filter(exp => exp.id).map(exp => exp.id);
      const experiencesToDelete = freshProfile.experiences.filter(exp => !expIdsInUI.includes(exp.id));
      for (const exp of experiencesToDelete) {
        await deleteExperience(exp.id);
      }

      // Process Educations
      for (const edu of tempData.educations.filter(edu => !edu.id)) {
        if (!edu.institution || !edu.degree) {
          console.warn("Skipping education due to missing required fields", edu);
          continue;
        }
        await createEducation(edu);
      }
      for (const edu of tempData.educations.filter(edu => edu.id)) {
        await updateEducation(edu.id, edu);
      }
      const freshProfile2 = await getUserProfile();
      const eduIdsInUI = tempData.educations.filter(edu => edu.id).map(edu => edu.id);
      const educationsToDelete = freshProfile2.educations.filter(edu => !eduIdsInUI.includes(edu.id));
      for (const edu of educationsToDelete) {
        await deleteEducation(edu.id);
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated!",
        timer: 2000,
        showConfirmButton: false,
        background: "#1C1F2E",
        color: "#ffffff"
      });

      await fetchUserProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "An error occurred while updating your profile.",
        background: "#1C1F2E",
        color: "#ffffff"
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    try {
      return format(new Date(dateString), "MMM yyyy");
    } catch {
      return dateString;
    }
  };

  // Education logic
  const addEducation = () => {
    setTempData({ ...tempData, educations: [...tempData.educations, { ...defaultEducation }] });
  };

  const removeEducation = (index) => {
    const edu = [...tempData.educations];
    edu.splice(index, 1);
    setTempData({ ...tempData, educations: edu });
  };

  const handleEducationChange = (index, e) => {
    const edu = [...tempData.educations];
    edu[index] = { ...edu[index], [e.target.name]: e.target.value };
    setTempData({ ...tempData, educations: edu });
  };

  // Experience logic
  const addExperience = () => {
    setTempData({ ...tempData, experiences: [...tempData.experiences, { ...defaultExperience }] });
  };

  const removeExperience = async (index) => {
    const exp = [...tempData.experiences];
    const experienceToRemove = exp[index];
    try {
      if (experienceToRemove.id) {
        await deleteExperience(experienceToRemove.id);
      }
      exp.splice(index, 1);
      setTempData({ ...tempData, experiences: exp });
      Swal.fire({
        icon: "success",
        title: "Experience Removed",
        timer: 1500,
        showConfirmButton: false,
        background: "#1C1F2E",
        color: "#ffffff"
      });
    } catch (error) {
      console.error("Error removing experience", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove experience. Please try again.",
        background: "#1C1F2E",
        color: "#ffffff"
      });
    }
  };

  const handleExperienceChange = (index, e) => {
    const exp = [...tempData.experiences];
    const fieldName = e.target.name;
    let value = e.target.value;
    if (fieldName === "currentlyWorking") {
      value = e.target.checked;
      if (value) exp[index].endDate = null;
    }
    exp[index] = { ...exp[index], [fieldName]: value };
    setTempData({ ...tempData, experiences: exp });
  };

  // Skill logic
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleAddSkill = async (skillName) => {
    try {
      // Prevent duplicate skills
      if (tempData.skills.some(skill => skill?.name?.toLowerCase() === skillName.toLowerCase())) {
        setSkillInput("");
        return;
      }
      const result = await addSkillToUser(skillName);
      const newSkill = { id: result.id, name: result.name };
      setUserData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setTempData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setSkillInput("");
      setShowSkillDropdown(false);
      Swal.fire({
        icon: "success",
        title: "Skill Added",
        text: `"${skillName}" has been added to your skills`,
        timer: 1500,
        showConfirmButton: false,
        background: "#1C1F2E",
        color: "#ffffff"
      });
    } catch (error) {
      console.error("Error adding skill", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add skill. Please try again.",
        background: "#1C1F2E",
        color: "#ffffff"
      });
    }
  };

  const handleAddCustomSkill = async () => {
    if (skillInput.trim()) {
      await handleAddSkill(skillInput.trim());
    }
  };

  const handleRemoveSkill = async (skillId, skillName) => {
    try {
      if (skillId) {
        await removeSkillFromUser(skillId);
      }
      const updatedSkills = tempData.skills.filter(
        (skill) => (skillId ? skill.id !== skillId : skill.name !== skillName)
      );
      setTempData({ ...tempData, skills: updatedSkills });
      setUserData({ ...userData, skills: updatedSkills });
      Swal.fire({
        icon: "success",
        title: "Skill Removed",
        text: `"${skillName}" has been removed from your skills`,
        timer: 1500,
        showConfirmButton: false,
        background: "#1C1F2E",
        color: "#ffffff"
      });
    } catch (error) {
      console.error("Error removing skill", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove skill. Please try again.",
        background: "#1C1F2E",
        color: "#ffffff"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">🐝 My Profile</h2>

      <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 border-b border-yellow-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-yellow-500 shadow-lg overflow-hidden bg-black/50">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-yellow-500/10 text-yellow-400">
                    <User size={48} />
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold text-white">{userData.fullName}</h2>
              <p className="text-gray-400 mb-1">@{userData.username}</p>
              {userData.bio && <p className="text-gray-300 text-sm mt-2 max-w-lg">{userData.bio}</p>}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => {
                if (!isEditing) setTempData({ ...userData });
                setIsEditing(!isEditing);
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center gap-2 transition-colors font-medium"
            >
              {isEditing ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {(userData.location || userData.phoneNumber || userData.website || userData.email) && (
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {userData.location && (
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userData.location}
                </div>
              )}
              {userData.phoneNumber && (
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-1" />
                  {userData.phoneNumber}
                </div>
              )}
              {userData.website && (
                <div className="flex items-center text-gray-400">
                  <Globe className="w-4 h-4 mr-1" />
                  <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    {userData.website.replace(/^https?:\/\//i, "")}
                  </a>
                </div>
              )}
              {userData.email && (
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-1" />
                  {userData.email}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Form / Read-only Display */}
        <div className="p-6">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Full Name", key: "fullName" },
                  { label: "Username", key: "username" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Phone Number", key: "phoneNumber" },
                  { label: "Location", key: "location" },
                  { label: "Website", key: "website" },
                  { label: "Bio", key: "bio", type: "textarea", span: true }
                ].map(({ label, key, type = "text", span }) => (
                  <div key={key} className={span ? "md:col-span-2" : ""}>
                    <label className="block text-gray-400 text-sm mb-2">{label}</label>
                    {type === "textarea" ? (
                      <textarea
                        name={key}
                        value={tempData[key] || ""}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 rounded-md border bg-[#181A28] text-white border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                      />
                    ) : (
                      <input
                        type={type}
                        name={key}
                        value={tempData[key] || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border bg-[#181A28] text-white border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Educations Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Educations</h3>
                {tempData.educations.map((edu, index) => (
                  <div key={index} className="border border-yellow-500 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-yellow-500 font-medium">Education #{index + 1}</span>
                      <button onClick={() => removeEducation(index)} className="text-red-500">Remove</button>
                    </div>
                    <input
                      type="text"
                      name="institution"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 mb-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                    />
                    <input
                      type="text"
                      name="degree"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 mb-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                    />
                    <input
                      type="text"
                      name="fieldOfStudy"
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 mb-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                    />
                    <input
                      type="date"
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 mb-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 mb-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={edu.description}
                      onChange={(e) => handleEducationChange(index, e)}
                      rows="2"
                      className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                    />
                  </div>
                ))}
                <button onClick={addEducation} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md">
                  Add Education
                </button>
              </div>

              {/* Experiences Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Work Experience</h3>
                {tempData.experiences.map((exp, index) => (
                  <div key={exp.id || index} className="border border-yellow-500/30 rounded-lg p-4 mb-4 bg-black/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-yellow-500 font-medium">Experience #{index + 1}</span>
                      <button onClick={() => removeExperience(index)} className="text-red-400 hover:text-red-300 transition-colors">
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Job Title*</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="e.g. Software Engineer"
                          value={exp.title || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Company*</label>
                        <input
                          type="text"
                          name="company"
                          placeholder="e.g. Google"
                          value={exp.company || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          placeholder="e.g. New York, NY"
                          value={exp.location || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Employment Type</label>
                        <select
                          name="employmentType"
                          value={exp.employmentType || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                        >
                          <option value="">Select Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Start Date*</label>
                        <input
                          type="date"
                          name="startDate"
                          value={exp.startDate || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-gray-400 text-xs mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={exp.endDate || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                          disabled={exp.currentlyWorking}
                        />
                        <div className="mt-2 flex items-center">
                          <input
                            type="checkbox"
                            id={`currentlyWorking-${index}`}
                            name="currentlyWorking"
                            checked={exp.currentlyWorking || false}
                            onChange={(e) => handleExperienceChange(index, e)}
                            className="mr-2 rounded border-yellow-500/30 text-yellow-500 focus:ring-yellow-500/50"
                          />
                          <label htmlFor={`currentlyWorking-${index}`} className="text-gray-400 text-xs">
                            I currently work here
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-xs mb-1">Description</label>
                        <textarea
                          name="description"
                          placeholder="Describe your responsibilities and achievements"
                          value={exp.description || ""}
                          onChange={(e) => handleExperienceChange(index, e)}
                          rows="3"
                          className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center gap-1 transition-colors">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              {/* Skills Section */}
              <div className="mt-8" ref={skillsContainerRef}>
                <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tempData.skills.length > 0 ? (
                    tempData.skills.map((skill, index) =>
                      skill?.name ? (
                        <div key={skill.id || index} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3 mr-1" />
                          <span>{skill.name}</span>
                          <button
                            onClick={() => handleRemoveSkill(skill.id, skill.name)}
                            className="hover:text-white focus:outline-none ml-1"
                            aria-label={`Remove ${skill.name} skill`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null
                    )
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No skills added yet. Add some skills to showcase your expertise!
                    </p>
                  )}
                </div>

                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={handleSkillInputChange}
                        placeholder="Add Skill (e.g. JavaScript, React, Java)"
                        className="w-full p-2 rounded-md border bg-[#181A28] text-white border-yellow-500/30 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                      />
                      {showSkillDropdown && filteredSkills.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[#181A28] border border-yellow-500/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredSkills.map((skill) => (
                            <button
                              key={skill.id}
                              onClick={() => handleAddSkill(skill.name)}
                              className="w-full text-left px-4 py-2 hover:bg-yellow-500/10 text-gray-300 hover:text-white"
                            >
                              {skill.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleAddCustomSkill}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-md flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Enter a skill and click "Add", or select from suggested skills
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div>
              {/* Read-only view for Skills */}
              {userData.skills && userData.skills.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) =>
                      skill?.name ? (
                        <div key={skill.id || index} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3 mr-1" />
                          <span>{skill.name}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  Click "Edit Profile" to update your information.
                </div>
              )}

              {/* Read-only view for Experiences */}
              {userData.experiences && userData.experiences.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Work Experience</h3>
                  <div className="space-y-6">
                    {userData.experiences.map((exp, index) => (
                      <div key={exp.id || index} className="relative pl-8 border-l-2 border-yellow-500/30">
                        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full -left-[9px] top-0"></div>
                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start mb-2">
                            <h4 className="text-yellow-400 font-bold text-lg">{exp.title}</h4>
                            <div className="text-gray-400 text-sm flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <div className="text-white/80 text-sm flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              <span>{exp.company}</span>
                            </div>
                            {exp.location && (
                              <div className="text-gray-400 text-sm flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                            {exp.employmentType && (
                              <div className="text-gray-400 text-sm flex items-center">
                                <Briefcase className="w-3 h-3 mr-1" />
                                <span>{exp.employmentType}</span>
                              </div>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-gray-300 text-sm whitespace-pre-line">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read-only view for Education */}
              {userData.educations && userData.educations.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
                  <div className="space-y-6">
                    {userData.educations.map((edu, index) => (
                      <div key={edu.id || index} className="relative pl-8 border-l-2 border-yellow-500/30">
                        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full -left-[9px] top-0"></div>
                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start mb-2">
                            <h4 className="text-yellow-400 font-bold text-lg">{edu.degree}</h4>
                            <div className="text-gray-400 text-sm flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <div className="text-white/80 text-sm flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              <span>{edu.institution}</span>
                            </div>
                            {edu.fieldOfStudy && (
                              <div className="text-gray-400 text-sm flex items-center">
                                <Tag className="w-3 h-3 mr-1" />
                                <span>{edu.fieldOfStudy}</span>
                              </div>
                            )}
                          </div>
                          {edu.description && (
                            <p className="text-gray-300 text-sm whitespace-pre-line">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            // Single Save All Changes Button
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
              >
                <Check className="w-5 h-5" /> Save Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'56\' height=\'100\' viewBox=\'0 0 56 100\'%3E%3Cpath fill=\'%23EAB308\' opacity=\'0.05\' d=\'M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100\'/%3E%3C/svg%3E")',
          backgroundSize: "112px 200px"
        }}
      ></div>
    </div>
  );
}
