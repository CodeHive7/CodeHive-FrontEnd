import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Fake user data
    const [userData, setUserData] = useState({
        avatar: "https://i.pravatar.cc/150?img=3", // Fake profile image
        fullName: "John Doe",
        email: "johndoe@example.com",
        username: "john_doe",
        bio: "Full-Stack Developer | React & Spring Boot Enthusiast",
        location: "New York, USA",
        website: "https://johndoe.dev",
    });

    const [tempData, setTempData] = useState({ ...userData });

    // Handle input changes
    const handleChange = (e) => {
        setTempData({ ...tempData, [e.target.name]: e.target.value });
    };

    // Save profile changes
    const handleSave = () => {
        setUserData(tempData);
        setIsEditing(false);
        Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile information has been successfully updated!",
            timer: 2000,
            showConfirmButton: false,
        });
    };

    return (
        <div className="max-w-3xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700">
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
                <div>
                    <label className="block text-gray-400 text-sm">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={tempData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                            isEditing ? "" : "cursor-not-allowed"
                        }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={tempData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                            isEditing ? "" : "cursor-not-allowed"
                        }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm">Bio</label>
                    <textarea
                        name="bio"
                        value={tempData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                            isEditing ? "" : "cursor-not-allowed"
                        }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={tempData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                            isEditing ? "" : "cursor-not-allowed"
                        }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm">Website</label>
                    <input
                        type="text"
                        name="website"
                        value={tempData.website}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700 focus:border-purple-600 focus:ring-0 ${
                            isEditing ? "" : "cursor-not-allowed"
                        }`}
                    />
                </div>

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
