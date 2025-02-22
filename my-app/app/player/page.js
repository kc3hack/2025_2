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
    console.log(session);
    const token = session?.token?.access_token;
    const userName = session?.user.email;

    const [position, setPosition] = useState([35.0127, 135.7094305]);
    const [index, setIndex] = useState(1);
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
    // useEffect(() => {
    //     const loop = setInterval(async () => {
    //         setD((prev) => prev + 0.001);
    //         const newPosi = [35.0127076, d];
    //         setPosition(newPosi);

    //         const musics = await getMusic(calc(newPosi[0], newPosi[1]));
    //         if (musics instanceof Promise) {
    //             musics.then((data) => {
    //                 console.log(data);
    //                 setMusics(data);
    //             });
    //         } else {
    //             setMusics(musics);
    //         }
    //     }, 1000);
    //     return () => clearInterval(loop);
    // }, [d]);

    useEffect(() => {
        const loop = setInterval(() => {
            setIndex((prev) => {
                return prev + 1
            })
        }, 5000);
        return () => { clearInterval(loop); }
    }, [])

    const musicData = [
        {
            Latitude: 35.0107,
            Longitude: 135.7114,
            music: {
                ArtistName: "Peter Hollens",
                Duration: 161158,
                ImageUrl: "https://i.scdn.co/image/ab67616d0000b2737e4bb4e6ec2e2799e6480cf2",
                MusicID: "spotify:track:6fRmmcYP9h2DgqcufEMj6x",
                MusicName: "Country Roads"
            }
        },
        {
            Latitude: 35.0107,
            Longitude: 135.7114,
            music: {
                ArtistName: "Mai Kuraki",
                Duration: 245533,
                ImageUrl: "https://i.scdn.co/image/ab67616d0000b273439ca7ef2ce81624e7ee3b7a",
                MusicID: "spotify:track:1060Rq2jA1jKckSZV67y7H",
                MusicName: "渡月橋 ～君 想ふ～"
            }
        },
        {
            Latitude: 35.0107,
            Longitude: 135.7114,
            music: {
                ArtistName: "Ado",
                Duration: 260368,
                ImageUrl: "https://i.scdn.co/image/ab67616d0000b2739e1c223d7a087f9dfb3757fe",
                MusicID: "spotify:track:5pnqpz99CGAvdzmMRsB5sD",
                MusicName: "Elf"
            }
        }

    ];

    return (
        <>
            <SimpleMap position={position} musics={musics} />
            <Player nextMusic={musicData[index % 3]} token={token} userName={userName} />
        </>
    )
}