"use client"
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from 'next/image'

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();
    console.log(session);
    const token = session?.token?.access_token;

    if (session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                {/* ロゴ */}
                 <Image src="/logo.png" width={500} height={500} alt="logo" className="mb-8" />
                 {/* アプリ起動ボタン */}
                <button
                    className="w-56 h-16 rounded-xl bg-[#432db0] text-white text-2xl font-semibold shadow-lg hover:bg-[#432db0] active:scale-[0.98] transition-all"
                    onClick={() => router.push('/player')}
                >
                    Launch Your App
                </button>
                
                <div className="mt-8"></div>
                {/* サインアウト */}
                <button
                    className="w-56 h-10 rounded-xl bg-white text-[#432db0] text-xl font-semibold shadow-lg hover:bg-white active:scale-[0.98] transition-all"
                    onClick={() => signOut()}
                >
                    Sign Out
                </button>

            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                {/* ロゴ */}
                <Image src="/logo.png" width={500} height={500} alt="logo" className="mb-8" />
                
                {/* サインイン */}
                <button
                    onClick={() => signIn()}
                    className="w-56 h-16 rounded-xl bg-[#432db0] text-white text-2xl font-semibold shadow-lg hover:bg-[#432db0] active:scale-[0.98] transition-all"
                >
                    Sign In
                </button>
            </div>

        )
    }
}