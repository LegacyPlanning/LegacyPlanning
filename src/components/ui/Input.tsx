import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full px-4 py-3 rounded-xl
                            bg-gray-50 dark:bg-gray-800
                            border border-gray-200 dark:border-gray-700
                            text-gray-900 dark:text-white
                            placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                            transition-all duration-200
                            ${icon ? "pl-10" : ""}
                            ${error ? "border-red-500 focus:ring-red-500" : ""}
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
