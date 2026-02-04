"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Shield, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!passwordRequirements.every((req) => req.met)) {
            setError("Please meet all password requirements");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Legacy Planning</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Secure your digital legacy</p>
                </div>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Start protecting your digital assets</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="w-5 h-5" />}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            {/* Password requirements */}
                            <div className="space-y-2">
                                {passwordRequirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                                            {req.met && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={req.met ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                icon={<Lock className="w-5 h-5" />}
                                error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
                                required
                            />

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" loading={loading}>
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-400 mt-6">
                    By signing up, you agree to protect your digital legacy
                </p>
            </div>
        </div>
    );
}
