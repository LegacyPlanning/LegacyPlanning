"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    className: "!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white !shadow-lg !rounded-xl",
                    duration: 4000,
                }}
            />
        </SessionProvider>
    );
}
