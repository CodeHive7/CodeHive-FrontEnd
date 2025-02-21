import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../../services/userService/UserService.js";
import { Pencil, Check, X } from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        avatar: "https://i.pravatar.cc/150?img=3", // Fake profile image
        fullName: "",
        email: "",
        username: "",
        bio: "",
        location: "",
        website: "",
    });

    const [tempData, setTempData] = useState({ ...userData });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const data = await getUserProfile();
            setUserData({
                ...data,
                avatar: "https://i.pravatar.cc/150?img=3", // Fake avatar
            });
            setTempData(data);
        } catch (error) {
            console.error("Error fetching user profile", error);
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
                text: "Your profile information has been successfully updated!",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "An error occurred while updating your profile. Please try again later.",
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700 mt-10">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-6">
                <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-purple-600 shadow-lg"
                />
                <div>
                    <h2 className="text-3xl font-semibold text-white">{userData.fullName}</h2>
                    <p className="text-gray-400">@{userData.username}</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                >
                    {isEditing ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                </button>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
                {[
                    { label: "Full Name", key: "fullName" },
                    { label: "Username", key: "username" },
                    { label: "Email", key: "email", type: "email" },
                    { label: "Bio", key: "bio", type: "textarea" },
                    { label: "Location", key: "location" },
                    { label: "phone number", key: "phoneNumber" },
                    { label: "Website", key: "website" },
                ].map(({ label, key, type = "text" }) => (
                    <div key={key}>
                        <label className="block text-gray-400 text-sm">{label}</label>
                        {type === "textarea" ? (
                            <textarea
                                name={key}
                                value={tempData[key] || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="3"
                                className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                                    isEditing ? "" : "cursor-not-allowed"
                                }`}
                            />
                        ) : (
                            <input
                                type={type}
                                name={key}
                                value={tempData[key] || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                                    isEditing ? "" : "cursor-not-allowed"
                                }`}
                            />
                        )}
                    </div>
                ))}

                {/* Save Button */}
                {isEditing && (
                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition"
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
}
