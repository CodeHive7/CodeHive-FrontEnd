import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfileByUsername } from "../../../services/userService/UserService.js";
import { ArrowLeft } from "lucide-react";

export default function ViewUserProfilePage() {
    const { username } = useParams(); // Get username from URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

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
        return <p className="text-gray-400 text-center text-lg">Loading profile...</p>;
    }

    if (!userData) {
        return <p className="text-red-500 text-center text-lg">User profile not found.</p>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#0A0B14] to-[#12141F] p-8 rounded-xl shadow-lg border border-yellow-500 mt-10 relative">
            {/* Back Button */}
            <Link to="/user/project-applicants" className="flex items-center text-yellow-400 hover:text-yellow-300 transition mb-6">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Applicants
            </Link>

            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-6">
                <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-yellow-500 shadow-md"
                />
                <div>
                    <h2 className="text-3xl font-semibold text-white">{userData.fullName}</h2>
                    <p className="text-gray-400">@{userData.username}</p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
                {[
                    { label: "Full Name", key: "fullName" },
                    { label: "Username", key: "username" },
                    { label: "Email", key: "email" },
                    { label: "Bio", key: "bio" },
                    { label: "Location", key: "location" },
                    { label: "Phone Number", key: "phoneNumber" },
                    { label: "Website", key: "website" },
                ].map(({ label, key }) => (
                    <div key={key}>
                        <label className="block text-gray-400 text-sm">{label}</label>
                        <p className="w-full p-3 rounded-md border bg-gray-900 text-white border-gray-700">{userData[key] || "Not available"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}