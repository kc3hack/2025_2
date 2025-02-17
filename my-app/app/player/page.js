"use client"
import { useSession } from "next-auth/react"
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function Home() {
    const { data: session } = useSession();
    console.log(session);
    const token = session?.token?.access_token;

    const SimpleMap = useMemo(
        () =>
            dynamic(() => import('./simpleMap'), {
                loading: () => <p>map loading...</p>,
                ssr: false,
            }),
        []
    );

    return (
        <>
            <SimpleMap />
        </>
    )
}