"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Settings,
    Clock,
    Mail,
    User,
    Save,
    Shield,
    AlertTriangle,
} from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings state
    const [dmsPeriod, setDmsPeriod] = useState(30);
    const [notifyEmail, setNotifyEmail] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setDmsPeriod(data.dmsPeriod);
                setNotifyEmail(data.notifyEmail || "");
                setName(data.name || "");
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dmsPeriod, notifyEmail, name }),
            });

            if (res.ok) {
                toast.success("Settings saved successfully!");
            } else {
                throw new Error("Failed to save settings");
            }
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Configure your account and Dead Man&apos;s Switch preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            Profile
                        </CardTitle>
                        <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Display Name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={session?.user?.email || ""}
                            disabled
                            className="opacity-60"
                        />
                    </CardContent>
                </Card>

                {/* DMS Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Dead Man&apos;s Switch
                        </CardTitle>
                        <CardDescription>Configure when your beneficiaries get notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Inactivity Period (days)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="7"
                                    max="90"
                                    value={dmsPeriod}
                                    onChange={(e) => setDmsPeriod(Number(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-500"
                                />
                                <span className="w-16 text-center font-bold text-lg text-indigo-600">
                                    {dmsPeriod}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Beneficiaries will be notified after {dmsPeriod} days of inactivity
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                        Important
                                    </p>
                                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                        Make sure to click &quot;I&apos;m Still Here&quot; regularly in the dashboard
                                        to prevent false triggers. Shorter periods require more frequent check-ins.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-green-500" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Emergency contact settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Emergency Contact Email (Optional)"
                            type="email"
                            placeholder="backup@example.com"
                            value={notifyEmail}
                            onChange={(e) => setNotifyEmail(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            This email will be CC&apos;d on important notifications. Leave blank to only notify beneficiaries.
                        </p>
                    </CardContent>
                </Card>

                {/* Security Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-500" />
                            Security
                        </CardTitle>
                        <CardDescription>Your security status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                                <span className="text-sm text-green-700 dark:text-green-400">
                                    ✓ End-to-end encryption enabled
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                                <span className="text-sm text-green-700 dark:text-green-400">
                                    ✓ Beneficiary identity verification required
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                <span className="text-sm text-blue-700 dark:text-blue-400">
                                    ℹ️ Client-side key generation
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving} size="lg">
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
