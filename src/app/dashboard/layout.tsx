"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Wallet,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    Heart,
} from "lucide-react";
import Button from "@/components/ui/Button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Assets", href: "/dashboard/assets", icon: Wallet },
    { name: "Beneficiaries", href: "/dashboard/beneficiaries", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleHeartbeat = async () => {
        try {
            await fetch("/api/user/heartbeat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session?.user?.email }),
            });
        } catch (error) {
            console.error("Heartbeat failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 dark:text-white">Legacy Planning</h1>
                            <p className="text-xs text-gray-500">Secure your future</p>
                        </div>
                        <button
                            className="ml-auto lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Heartbeat Button */}
                    <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            onClick={handleHeartbeat}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-200"
                        >
                            <Heart className="w-5 h-5 animate-pulse" />
                            I&apos;m Still Here
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Click to reset your DMS timer
                        </p>
                    </div>

                    {/* User */}
                    <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {session?.user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {session?.user?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Mobile header */}
                <header className="sticky top-0 z-30 flex items-center gap-4 px-4 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-indigo-500" />
                        <span className="font-bold text-gray-900 dark:text-white">Legacy Planning</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
