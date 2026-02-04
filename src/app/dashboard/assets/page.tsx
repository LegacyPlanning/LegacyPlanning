"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Wallet,
    CreditCard,
    FileText,
    Bitcoin,
    Trash2,
    Eye,
    EyeOff,
    Copy,
    Check,
} from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Asset {
    id: string;
    name: string;
    type: string;
    platform: string | null;
    createdAt: string;
}

const assetTypes = [
    { value: "subscription", label: "Subscription", icon: CreditCard, color: "text-blue-500" },
    { value: "investment", label: "Investment", icon: Wallet, color: "text-green-500" },
    { value: "legal_document", label: "Legal Document", icon: FileText, color: "text-amber-500" },
    { value: "crypto", label: "Crypto Wallet", icon: Bitcoin, color: "text-orange-500" },
    { value: "text_note", label: "Text Note", icon: FileText, color: "text-purple-500" },
];

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("text_note");
    const [platform, setPlatform] = useState("");
    const [sensitiveData, setSensitiveData] = useState("");
    const [encryptionKey, setEncryptionKey] = useState("");
    const [copiedKey, setCopiedKey] = useState(false);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/assets");
            if (res.ok) {
                const data = await res.json();
                setAssets(data.assets);
            }
        } catch (error) {
            console.error("Failed to fetch assets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAsset = async () => {
        if (!assetName || !sensitiveData) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSaving(true);
        try {
            // Client-side encryption
            const { generateKey, encryptData, exportKey } = await import("@/lib/encryption");
            const key = await generateKey();
            const { ciphertext, iv } = await encryptData({ content: sensitiveData }, key);

            const exportedKey = await exportKey(key);
            setEncryptionKey(exportedKey);

            // Send to server
            const res = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: assetName,
                    type: assetType,
                    platform,
                    encryptedData: JSON.stringify({ ciphertext, iv }),
                }),
            });

            if (res.ok) {
                toast.success("Asset encrypted and saved!");
                fetchAssets();
                // Don't close modal - show the key first
            } else {
                throw new Error("Failed to save asset");
            }
        } catch (error) {
            console.error("Error saving asset:", error);
            toast.error("Failed to save asset");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAsset = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;

        try {
            const res = await fetch(`/api/assets?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Asset deleted");
                fetchAssets();
            }
        } catch (error) {
            toast.error("Failed to delete asset");
        }
    };

    const closeAndReset = () => {
        setShowAddModal(false);
        setAssetName("");
        setAssetType("text_note");
        setPlatform("");
        setSensitiveData("");
        setEncryptionKey("");
        setCopiedKey(false);
    };

    const copyKey = () => {
        navigator.clipboard.writeText(encryptionKey);
        setCopiedKey(true);
        toast.success("Key copied to clipboard!");
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const getAssetIcon = (type: string) => {
        const assetType = assetTypes.find((t) => t.value === type);
        if (assetType) {
            const Icon = assetType.icon;
            return <Icon className={`w-5 h-5 ${assetType.color}`} />;
        }
        return <FileText className="w-5 h-5 text-gray-500" />;
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assets</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage your encrypted digital assets
                    </p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Asset
                </Button>
            </div>

            {/* Assets Grid */}
            {assets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset) => (
                        <Card key={asset.id} variant="glass" className="hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            {getAssetIcon(asset.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {asset.name}
                                            </h3>
                                            {asset.platform && (
                                                <p className="text-sm text-gray-500">{asset.platform}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAsset(asset.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <Badge variant="info" size="sm">
                                        {assetTypes.find((t) => t.value === asset.type)?.label || asset.type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <EyeOff className="w-4 h-4" />
                                        <span>Encrypted & Secure</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card variant="bordered" className="text-center py-12">
                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No assets yet</h3>
                    <p className="text-gray-500 mt-1">Add your first encrypted asset to get started</p>
                    <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Asset
                    </Button>
                </Card>
            )}

            {/* Add Asset Modal */}
            <Modal isOpen={showAddModal} onClose={closeAndReset} title="Add New Asset" size="lg">
                {!encryptionKey ? (
                    <div className="space-y-5">
                        <Input
                            label="Asset Name"
                            placeholder="e.g., Netflix Account, Bitcoin Wallet"
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Asset Type
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {assetTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setAssetType(type.value)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${assetType === type.value
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        <type.icon className={`w-5 h-5 ${type.color}`} />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Platform (Optional)"
                            placeholder="e.g., Binance, Google Drive"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sensitive Data (will be encrypted)
                            </label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[120px] font-mono text-sm"
                                placeholder="Enter passwords, recovery phrases, important notes..."
                                value={sensitiveData}
                                onChange={(e) => setSensitiveData(e.target.value)}
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                ⚠️ Your data will be encrypted locally. The encryption key will be shown after saving.
                                <strong className="block mt-1">You must save this key securely - we cannot recover it!</strong>
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={closeAndReset} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleAddAsset} loading={saving} className="flex-1">
                                Encrypt & Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Asset Saved!</h3>
                            <p className="text-gray-500 mt-1">Your data has been encrypted and stored securely.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                🔐 Your Encryption Key
                            </label>
                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={encryptionKey}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs min-h-[100px]"
                                />
                                <button
                                    onClick={copyKey}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white dark:bg-gray-700 shadow hover:bg-gray-50 transition-colors"
                                >
                                    {copiedKey ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-400">
                                ⚠️ <strong>IMPORTANT:</strong> Save this key somewhere safe (password manager, secure note).
                                Without this key, your data cannot be decrypted. We do not store this key!
                            </p>
                        </div>

                        <Button onClick={closeAndReset} className="w-full">
                            I&apos;ve Saved My Key
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
