"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
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
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>Sign in to access your vault</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
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

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" loading={loading}>
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Your data is encrypted and secure
                </p>
            </div>
        </div>
    );
}
