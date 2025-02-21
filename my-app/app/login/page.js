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
            <div className='p-6'>
                <span className='bold-txt'>{token}</span>
                <p className='opacity-70 mt-8 mb-5 underline cursor-pointer' onClick={() => signOut()}>Sign Out</p>
                <button 
                        className='shadow-primary w-56 h-16 rounded-xl bg-white border-0 text-black text-3xl active:scale-[0.99]' 
                        onClick={() => router.push('/player')}
                    >
                        Home
                    </button>
            </div>
        )
    } else {
        return (
            <button onClick={() => signIn()} className='shadow-primary w-56 h-16 rounded-xl bg-white border-0 text-black text-3xl active:scale-[0.99] m-6'>Sign In</button>
        )
    }
}