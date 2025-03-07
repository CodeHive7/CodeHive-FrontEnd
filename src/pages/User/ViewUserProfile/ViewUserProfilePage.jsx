import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfileByUsername } from "../../../services/userService/UserService.js";
import { ArrowLeft, Loader2, User, MapPin, Phone, Globe, Mail, FileText, AtSign } from "lucide-react";

export default function ViewUserProfilePage() {
    const { username } = useParams(); // Get username from URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            const data = await getUserProfileByUsername(username);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user profile", error);
        } finally {
            setLoading(false);
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

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-[#1C1F2E] border border-red-500/50 rounded-lg p-6">
                <div className="bg-red-500/10 p-4 rounded-full mb-3">
                    <User className="w-10 h-10 text-red-500/70" />
                </div>
                <p className="text-red-400 text-lg">User profile not found</p>
                <p className="text-gray-500 text-sm mt-1">The user you're looking for doesn't exist or has been removed</p>
                <Link
                    to="/user/project-applicants"
                    className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Applicants
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <Link to="/user/project-applicants" className="flex items-center text-yellow-400 hover:text-yellow-300 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Applicants
                </Link>
                <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                    Profile View
                </span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6">🐝 User Profile</h2>

            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 border-b border-yellow-500/30">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Avatar */}
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

                        {/* User Info */}
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-bold text-white">{userData.fullName}</h2>
                            <p className="text-gray-400 mb-1">@{userData.username}</p>
                            {userData.bio && (
                                <p className="text-gray-300 text-sm mt-2 max-w-lg">{userData.bio}</p>
                            )}
                        </div>
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

                {/* Profile Details */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4">Profile Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "Full Name", key: "fullName", icon: <User className="w-4 h-4 text-yellow-400" /> },
                            { label: "Username", key: "username", icon: <AtSign className="w-4 h-4 text-yellow-400" /> },
                            { label: "Email", key: "email", icon: <Mail className="w-4 h-4 text-yellow-400" /> },
                            { label: "Phone Number", key: "phoneNumber", icon: <Phone className="w-4 h-4 text-yellow-400" /> },
                            { label: "Location", key: "location", icon: <MapPin className="w-4 h-4 text-yellow-400" /> },
                            { label: "Website", key: "website", icon: <Globe className="w-4 h-4 text-yellow-400" /> },
                            { label: "Bio", key: "bio", icon: <FileText className="w-4 h-4 text-yellow-400" />, span: true },
                        ].map(({ label, key, icon, span }) => (
                            <div key={key} className={span ? "md:col-span-2" : ""}>
                                <div className="flex items-center mb-1.5">
                                    {icon}
                                    <label className="block text-gray-400 text-sm ml-2">{label}</label>
                                </div>
                                <div className="w-full p-3 rounded-md border bg-[#181A28] text-white border-yellow-500/30">
                                    {userData[key] || "Not available"}
                                </div>
                            </div>
                        ))}
                    </div>
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