import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        />
    );
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = true }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`rounded-lg border border-gray-200 p-4 bg-white shadow-sm ${hover && onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300 transition-all' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
    const variantClasses = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
            {children}
        </span>
    );
}

interface TabsProps {
    tabs: { label: string; value: string }[];
    activeTab: string;
    onTabChange: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <div className="flex gap-2 border-b border-gray-200">
            {tabs.map(tab => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === tab.value
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export function Input({ icon, className = '', ...props }: InputProps) {
    return (
        <div className="relative">
            {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
            <input
                className={`w-full rounded-lg border border-gray-300 px-4 py-2 ${icon ? 'pl-10' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
                {...props}
            />
        </div>
    );
}
