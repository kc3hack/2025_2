"use client"
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();
    console.log(session);
    const token = session?.token?.access_token;
    if (session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">

                <button
                    className="w-56 h-16 rounded-xl bg-blue-500 text-white text-2xl font-semibold shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all"
                    onClick={() => router.push('/player')}
                >
                    Home
                </button>
                <p className='opacity-70 mt-8 mb-5 underline cursor-pointer' onClick={() => signOut()}>Sign Out</p>

            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <button
                    onClick={() => signIn()}
                    className="w-56 h-16 rounded-xl bg-blue-500 text-white text-2xl font-semibold shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all"
                >
                    Sign In
                </button>
            </div>

        )
    }
}