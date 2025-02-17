"use client"
import { useSession } from "next-auth/react"

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const token = session?.token?.access_token;

    return (
        <>
            <p>コレクションページ</p>
        </>
    )
}