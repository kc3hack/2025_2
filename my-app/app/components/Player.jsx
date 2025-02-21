"use client"
import { useState, useEffect } from "react";

export default function Player({ nextMusic, token }) {
    const [isPlay, setIsPlay] = useState(false);
    const [nowMusic, setNowMusic] = useState(null);
    if (!nowMusic) {
        setNowMusic(nextMusic)
    }

    useEffect(() => {
        const loop = setInterval(async () => {
            console.log(token)
            if (token && isPlay) {
                const res = await fetch(`/api/player/spotify?token=${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (res.ok) {
                    const R = await res.json();
                    console.log(R);
                }
            }
        }, 5000);
        return () => clearInterval(loop);
    }, [token])

    return (
        <div className="fixed bottom-0 left-0 w-full h-32 z-50 bg-blue-700 text-white flex items-center px-6">
            <img
                src={nowMusic ? nowMusic.music.ImageUrl : "/image-solid.svg"} // 任意の画像に変更
                alt="Song Thumbnail"
                className="w-16 h-16 rounded-md object-cover bg-white"
            />
            <div className="flex-1 ml-4">
                <div className="text-lg font-bold">{nowMusic ? nowMusic.music.MusicName : "Title"}</div>
                <div className="text-sm">{nowMusic ? nowMusic.music.ArtistName : "artist"}</div>
            </div>
            {/* 再生ボタン ボタン連打対策的な処理があってもいいかも*/}
            <button
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                onClick={async () => {
                    const action = isPlay ? "pause" : "play";
                    const musicID = "spotify:id"
                    const res = await fetch("/api/player/spotify", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ action, token, musicID })
                    })
                    if (res.ok) {
                        setIsPlay(!isPlay)
                    }
                }}
            >
                <img
                    src={!isPlay ? "/play-solid.svg" : "pause-solid.svg"}
                    alt="Play Button"
                    className="w-8 h-8"
                />
            </button>
        </div>
    );
}