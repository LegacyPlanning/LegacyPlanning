"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Users,
    Mail,
    Trash2,
    Copy,
    Check,
    UserPlus,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Beneficiary {
    id: string;
    name: string;
    email: string;
    relationship: string;
    accessKey: string;
    verificationStatus: string;
    createdAt: string;
}

const relationships = [
    "Spouse",
    "Child",
    "Parent",
    "Sibling",
    "Friend",
    "Business Partner",
    "Lawyer",
    "Other",
];

export default function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [relationship, setRelationship] = useState("");

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            const res = await fetch("/api/beneficiaries");
            if (res.ok) {
                const data = await res.json();
                setBeneficiaries(data.beneficiaries);
            }
        } catch (error) {
            console.error("Failed to fetch beneficiaries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBeneficiary = async () => {
        if (!name || !email || !relationship) {
            toast.error("Please fill in all fields");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/beneficiaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, relationship }),
            });

            if (res.ok) {
                toast.success("Beneficiary added! They will be notified by email.");
                fetchBeneficiaries();
                closeAndReset();
            } else {
                const data = await res.json();
                throw new Error(data.error || "Failed to add beneficiary");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteBeneficiary = async (id: string) => {
        if (!confirm("Are you sure you want to remove this beneficiary?")) return;

        try {
            const res = await fetch(`/api/beneficiaries?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Beneficiary removed");
                fetchBeneficiaries();
            }
        } catch (error) {
            toast.error("Failed to remove beneficiary");
        }
    };

    const closeAndReset = () => {
        setShowAddModal(false);
        setName("");
        setEmail("");
        setRelationship("");
    };

    const copyAccessKey = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        toast.success("Access key copied!");
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "VERIFIED":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "FAILED":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-amber-500" />;
        }
    };

    const getStatusVariant = (status: string): "success" | "danger" | "warning" => {
        switch (status) {
            case "VERIFIED":
                return "success";
            case "FAILED":
                return "danger";
            default:
                return "warning";
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Beneficiaries</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage who can access your digital legacy
                    </p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Beneficiary
                </Button>
            </div>

            {/* Beneficiaries List */}
            {beneficiaries.length > 0 ? (
                <div className="space-y-4">
                    {beneficiaries.map((beneficiary) => (
                        <Card key={beneficiary.id} variant="glass">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/25">
                                            {beneficiary.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                {beneficiary.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Mail className="w-4 h-4" />
                                                <span className="truncate">{beneficiary.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge variant="info" size="sm">
                                                    {beneficiary.relationship}
                                                </Badge>
                                                <Badge variant={getStatusVariant(beneficiary.verificationStatus)} size="sm">
                                                    {getStatusIcon(beneficiary.verificationStatus)}
                                                    <span className="ml-1">{beneficiary.verificationStatus}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:pl-4 sm:border-l sm:border-gray-200 dark:border-gray-700">
                                        <div className="flex-1 sm:flex-none">
                                            <p className="text-xs text-gray-500 mb-1">Access Key</p>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                                                    {beneficiary.accessKey.substring(0, 8)}...
                                                </code>
                                                <button
                                                    onClick={() => copyAccessKey(beneficiary.accessKey)}
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    {copiedKey === beneficiary.accessKey ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                                    Added {formatDistanceToNow(new Date(beneficiary.createdAt), { addSuffix: true })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card variant="bordered" className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No beneficiaries yet</h3>
                    <p className="text-gray-500 mt-1">Add someone you trust to access your digital legacy</p>
                    <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Add Beneficiary
                    </Button>
                </Card>
            )}

            {/* Add Beneficiary Modal */}
            <Modal isOpen={showAddModal} onClose={closeAndReset} title="Add Beneficiary">
                <div className="space-y-5">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Relationship
                        </label>
                        <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Select relationship</option>
                            {relationships.map((rel) => (
                                <option key={rel} value={rel}>
                                    {rel}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                            ℹ️ The beneficiary will receive an email notification when added.
                            When your DMS is triggered, they&apos;ll receive access instructions and their unique access key.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={closeAndReset} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleAddBeneficiary} loading={saving} className="flex-1">
                            Add Beneficiary
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
