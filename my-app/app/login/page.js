"use client"
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const token = session?.token?.access_token;
    if (session) {
        return (
            <div className='p-6'>
                <span className='bold-txt'>{token}</span>
                <p className='opacity-70 mt-8 mb-5 underline cursor-pointer' onClick={() => signOut()}>Sign Out</p>
            </div>
        )
    } else {
        return (
            <button onClick={() => signIn()} className='shadow-primary w-56 h-16 rounded-xl bg-white border-0 text-black text-3xl active:scale-[0.99] m-6'>Sign In</button>
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