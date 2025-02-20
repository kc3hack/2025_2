"use client"

import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
    const { data: session } = useSession();
    const token = session?.token?.access_token;

    useEffect(() => {
        if (session) {
            console.log("Session data:", session);
        }
    },[session]);

    if (session) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <div className="p-6 rounded-lg shadow-lg bg-white max-w-xs w-full text-center">
                    <span className="block text-black font-bold mb-4">{token}</span>
                    <p className="opacity-70 underline cursor-pointer text-blue-500" onClick={() => signOut()}>Sign Out</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <button 
                    onClick={() => signIn()} 
                    className="w-64 h-16 rounded-full bg-white border-2 border-gray-300 text-black text-3xl shadow-lg active:scale-[0.99] transform transition-transform">
                    Sign In
                </button>
            </div>
        );
    }
}