
import React, { useState, useEffect, useRef } from "react";
import { User, Camera } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

const Settings = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: null
    });

    const [formData, setFormData] = useState(profile);
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef(null);

    // Fetch user profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
                    credentials: "include",
                });
                const data = await response.json();
                
                if (data?.user) {
                    const user = data.user;
                    const profileData = {
                        name: user.name || "",
                        email: user.email || "",
                        avatar: user.image || null
                    };
                    setProfile(profileData);
                    setFormData(profileData);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: imageUrl }));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = (e) => {
        e.preventDefault();
        // TODO: Implement update API endpoint
        setProfile(formData);
        console.log("Profile updated:", formData);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white/60">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-white/60">Manage your account preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-[#060010] text-white font-medium">
                        <User size={18} />
                        Profile
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30 overflow-hidden">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>
                                            {formData.name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <div
                                    onClick={triggerFileInput}
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button variant="secondary" className="mb-2" onClick={triggerFileInput}>
                                    Change Avatar
                                </Button>
                                <p className="text-xs text-white/40">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form className="space-y-6" onSubmit={handleSave}>
                            <Input
                                id="name"
                                label="Name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <Input
                                id="email"
                                type="email"
                                label="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <div className="pt-4 flex justify-end">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;