"use client"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const token = session?.token?.access_token;

    async function play() {
        try {
            await fetch(`/api/play`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <p>再生するページ</p>
            <button onClick={() => {
                play();
            }}>再生</button>
        </>
    )
}