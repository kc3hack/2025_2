"use client"

import styles from "next-auth/react"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    const [users, setUsers] = useState("");
    console.log(session);
    const token = session?.token?.access_token;

    useEffect(() => {
        if (!session?.user?.email) return; // ユーザーが未ログインなら実行しない
        // ページが読み込まれたらデータを取得する
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/collectiondb?email=${session.user.email}`);
                const json = await res.json();
                console.log(json);
                setUsers(JSON.stringify(json, null, "\t"));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [session]); 

    return (
        <div className="p-4">
            <header />

            <h1 className="text-2xl font-bold text-center mb-6">Collections</h1>
            <br />
            

        </div>
    )
}