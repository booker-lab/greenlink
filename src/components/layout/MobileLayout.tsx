import React from 'react';

interface MobileLayoutProps {
    children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <main className="w-full max-w-7xl bg-white min-h-screen shadow-xl relative transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
