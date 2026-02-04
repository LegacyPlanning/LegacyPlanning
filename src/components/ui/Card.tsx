import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "bordered";
    padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", variant = "default", padding = "md", children, ...props }, ref) => {
        const baseStyles = "rounded-2xl transition-all duration-200";

        const variants = {
            default: "bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50",
            glass: "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl",
            bordered: "bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800",
        };

        const paddings = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export const CardHeader = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`mb-4 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${className}`} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ className = "", children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={className} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
