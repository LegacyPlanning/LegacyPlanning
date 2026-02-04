"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Wallet,
    Users,
    Clock,
    Activity,
    TrendingUp,
    Shield,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

interface Stats {
    totalAssets: number;
    totalBeneficiaries: number;
    dmsStatus: string;
    lastActive: string;
    dmsPeriod: number;
}

interface ActivityItem {
    id: string;
    type: string;
    message: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                fetch("/api/dashboard/stats"),
                fetch("/api/activity"),
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            if (activityRes.ok) {
                const data = await activityRes.json();
                setActivities(data.activities);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "success";
            case "PENDING":
                return "warning";
            case "TRIGGERED":
                return "danger";
            default:
                return "default";
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "heartbeat":
                return <Activity className="w-4 h-4 text-green-500" />;
            case "login":
                return <Shield className="w-4 h-4 text-blue-500" />;
            case "asset_added":
                return <Wallet className="w-4 h-4 text-purple-500" />;
            case "beneficiary_added":
                return <Users className="w-4 h-4 text-indigo-500" />;
            case "dms_triggered":
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default:
                return <CheckCircle className="w-4 h-4 text-gray-500" />;
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {session?.user?.name || "User"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Here&apos;s an overview of your digital legacy
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Assets</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {stats?.totalAssets || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiaries</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {stats?.totalBeneficiaries || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">DMS Status</p>
                                <div className="mt-2">
                                    <Badge variant={getStatusVariant(stats?.dmsStatus || "ACTIVE")} size="md">
                                        {stats?.dmsStatus || "ACTIVE"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">DMS Period</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                    {stats?.dmsPeriod || 30} <span className="text-lg">days</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Last Active Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            Activity Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Last Activity</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                                    {stats?.lastActive
                                        ? formatDistanceToNow(new Date(stats.lastActive), { addSuffix: true })
                                        : "Never"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Timer Status</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                                    {stats?.dmsPeriod || 30} days until DMS activation
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activities.length > 0 ? (
                                activities.slice(0, 5).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No activity yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
