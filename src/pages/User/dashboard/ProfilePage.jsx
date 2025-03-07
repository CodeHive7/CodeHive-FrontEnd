import { useState, useEffect } from "react";
        import { getUserProfile, updateUserProfile } from "../../../services/userService/UserService.js";
        import { Pencil, Check, X, Camera, User, Loader2, MapPin, Phone, Globe, Mail } from "lucide-react";
        import Swal from "sweetalert2";

        export default function ProfilePage() {
            const [isEditing, setIsEditing] = useState(false);
            const [loading, setLoading] = useState(true);
            const [userData, setUserData] = useState({
                avatar: "https://i.pravatar.cc/150?img=3", // Temporary avatar
                fullName: "",
                email: "",
                username: "",
                bio: "",
                location: "",
                phoneNumber: "",
                website: "",
            });

            const [tempData, setTempData] = useState({ ...userData });

            useEffect(() => {
                fetchUserProfile();
            }, []);

            const fetchUserProfile = async () => {
                setLoading(true);
                try {
                    const data = await getUserProfile();
                    setUserData({
                        ...data,
                        avatar: data.avatar || "https://i.pravatar.cc/150?img=3",
                    });
                    setTempData(data);
                } catch (error) {
                    console.error("Error fetching user profile", error);
                } finally {
                    setLoading(false);
                }
            };

            const handleChange = (e) => {
                setTempData({ ...tempData, [e.target.name]: e.target.value });
            };

            const handleSave = async () => {
                try {
                    await updateUserProfile(tempData);
                    setUserData(tempData);
                    setIsEditing(false);
                    Swal.fire({
                        icon: "success",
                        title: "Profile Updated",
                        text: "Your profile has been successfully updated!",
                        timer: 2000,
                        showConfirmButton: false,
                        background: "#1C1F2E",
                        color: "#ffffff"
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Update Failed",
                        text: "An error occurred while updating your profile. Please try again.",
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
                                {/* Profile Avatar */}
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full border-4 border-yellow-500 shadow-lg overflow-hidden bg-black/50">
                                        {userData.avatar ? (
                                            <img
                                                src={userData.avatar}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
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
                                    {userData.bio && (
                                        <p className="text-gray-300 text-sm mt-2 max-w-lg">{userData.bio}</p>
                                    )}
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            setTempData({ ...userData });
                                        }
                                        setIsEditing(!isEditing);
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center gap-2 transition-colors font-medium"
                                >
                                    {isEditing ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>

                            {userData.location || userData.phoneNumber || userData.website ? (
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
                                                {userData.website.replace(/^https?:\/\//i, '')}
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
                            ) : null}
                        </div>

                        {/* Profile Form */}
                        <div className="p-6">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: "Full Name", key: "fullName" },
                                        { label: "Username", key: "username" },
                                        { label: "Email", key: "email", type: "email" },
                                        { label: "Phone Number", key: "phoneNumber" },
                                        { label: "Location", key: "location" },
                                        { label: "Website", key: "website" },
                                        { label: "Bio", key: "bio", type: "textarea", span: true },
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
                            ) : (
                                <div className="text-center text-gray-400 py-4">
                                    Click "Edit Profile" to update your information
                                </div>
                            )}

                            {/* Save Button */}
                            {isEditing && (
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
                                    >
                                        <Check className="w-5 h-5" /> Save Changes
                                    </button>
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