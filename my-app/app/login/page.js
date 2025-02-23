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
                

                 <Image src="/logo.png" width={500} height={500} alt="logo" className="mb-8" />


                <button
                    className="w-56 h-16 rounded-xl bg-[#432db0] text-white text-2xl font-semibold shadow-lg hover:bg-[#432db0] active:scale-[0.98] transition-all"
                    onClick={() => router.push('/player')}
                >
                    Launch Your App
                </button>

                <div className="mt-8"></div>

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
                <Image src="/logo.png" width={500} height={500} alt="logo" className="mb-8" />

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

// "use client";
// import { signIn, signOut, useSession } from "next-auth/react";

// export default function LoginPage() {
//   const { data: session } = useSession();

//   return (
//     <div>
//       {session ? (
//         <>
//           <p>こんにちは, {session.user.name} さん</p>
//           <button onClick={() => signOut()}>ログアウト</button>
//         </>
//       ) : (
//         <button onClick={() => signIn("spotify")}>Spotifyでログイン</button>
//       )}
//     </div>
//   );
// }