import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context'; 

const Navbar: React.FC = () => {
    const { auth, logout } = useAuth();

    return (
        <nav className="bg-gray-600 dark:bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-lg font-bold">GeoData Management System </h1>
                </Link>
                <div>
                    {auth.isAuthenticated ? (
                        <>
                            <button onClick={() => logout()} className="p-2 bg-red-500 rounded">Logout</button>
                        </>
                    ) : (
                        <div className="flex flex-row">
                            <Link href="/login">
                                <p className="mr-4">Login</p>
                            </Link>
                            <Link href="/register">
                                <p className="mr-4">Register</p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
