"use client"
import { useSession } from "next-auth/react"
import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import Player from "../components/Player";

async function getMusic(blockNo) {
    const res = await fetch(`/api/player?blockNo=${blockNo}`);
    const musics = await res.json();
    console.log(blockNo)
    return musics;
}

export default function Home() {
    const { data: session } = useSession();
    const token = session?.token?.access_token;

    const [position, setPosition] = useState([35.0127, 135.7094305]);
    const [musics, setMusics] = useState([]);
    const [d, setD] = useState(135.7094442);

    const SimpleMap = useMemo(
        () =>
            dynamic(() => import('./simpleMap'), {
                loading: () => <p>map loading...</p>,
                ssr: false,
            }),
        []
    );

    function calc(Latitude, Longitude) {
        return (Math.floor((Latitude + 90) / 0.01) * 2700 + Math.floor((Longitude + 180) / 0.01));
    }

    // useEffect(() => {
    //     console.log("OK");
    //     const loop = setInterval(() => {
    //         navigator.geolocation.getCurrentPosition(async (posi) => {
    //             const newPosi = [posi.coords.latitude, posi.coords.longitude];
    //             console.log(newPosi)
    //             setPosition(newPosi);
    //             // setPosition((prev) => [prev[0], prev[1] + 0.001]);
    //             const musics = await getMusic(calc(newPosi[0], newPosi[1]));
    //             if (musics instanceof Promise) {
    //                 musics.then((data) => {
    //                     console.log(data);
    //                     setMusics(data);
    //                 });
    //             } else {
    //                 setMusics(musics);
    //             }
    //         });
    //     }, 1000);
    //     return () => clearInterval(loop);
    // }, []);
    useEffect(() => {
        const loop = setInterval(async () => {
            setD((prev) => prev + 0.001);
            const newPosi = [35.0127076, d];
            setPosition(newPosi);

            const musics = await getMusic(calc(newPosi[0], newPosi[1]));
            if (musics instanceof Promise) {
                musics.then((data) => {
                    console.log(data);
                    setMusics(data);
                });
            } else {
                setMusics(musics);
            }
        }, 1000);
        return () => clearInterval(loop);
    }, [d]);

    return (
        <>
            <SimpleMap position={position} musics={musics} />
            <Player />
        </>
    )
}