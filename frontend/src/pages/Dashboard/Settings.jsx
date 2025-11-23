
import React, { useState, useRef } from "react";
import { User, Shield, Bell, Moon, Camera } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

/**
 * Settings page.
 * This is where users can tweak their profile and preferences.
 * Right now it's mostly frontend state, but ready for API integration.
 */
const Settings = () => {
    // We're mocking the user profile here.
    // In production, this would obviously come from your auth context or an API call.
    const [profile, setProfile] = useState({
        firstName: "Somesh",
        lastName: "Talligeri",
        email: "somesh@example.com",
        avatar: null // Can be a URL or base64 string
    });

    // Keep a local copy of the form data so we don't update the UI until the user hits save.
    const [formData, setFormData] = useState(profile);

    // Hidden input for the file upload hack
    const fileInputRef = useRef(null);

    // Generic handler for text inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle the image upload.
    // We create a local object URL for instant preview.
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: imageUrl }));
        }
    };

    // Proxy click to the hidden file input
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Commit the changes to the "real" profile state.
    const handleSave = (e) => {
        e.preventDefault();
        // TODO: Add actual API call here
        setProfile(formData);

        // Maybe add a nice toast notification here later?
        console.log("Profile updated:", formData);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-white/60">Manage your account and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { icon: User, label: "Profile", active: true },
                        { icon: Shield, label: "Security" },
                        { icon: Bell, label: "Notifications" },
                        { icon: Moon, label: "Appearance" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                ? "bg-white/10 text-white font-medium"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30 overflow-hidden">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>
                                            {formData.firstName?.charAt(0) || ""}
                                            {formData.lastName?.charAt(0) || ""}
                                        </span>
                                    )}
                                </div>
                                {/* Hover overlay for avatar */}
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
                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    id="firstName"
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <Input
                                    id="lastName"
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

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

                    {/* API Token Section */}
                    <Card className="p-8 mt-8">
                        <h2 className="text-xl font-semibold text-white mb-6">API Access</h2>
                        <p className="text-sm text-white/60 mb-4">
                            Use this token to authenticate with the CLI.
                        </p>

                        <div className="flex gap-2">
                            <Input
                                className="font-mono text-sm"
                                readOnly
                                value="sk_live_51J9z...x8s9"
                            />
                            <Button variant="secondary">Copy</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
