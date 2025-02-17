"use client"
import { useSession } from "next-auth/react"

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const token = session?.token?.access_token;

    async function play(status) {
        try {
            await fetch(`/api/play`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, status }),
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <p>再生するページ</p>
            <button onClick={() => { play("play"); }}>再生</button>
            <button onClick={() => { play("pause") }}>停止</button>
        </>
    )
}