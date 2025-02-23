"use client"
import { useState, useEffect } from "react";

export default function Player({ nextMusic, token, userName }) {
    const [isPlay, setIsPlay] = useState(false);
    const [nextCheckTime, setNextCheckTime] = useState(500);
    const [nowMusic, setNowMusic] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    function showError(message) {
        switch (message) {
            case "Unauthorized":
                alert("⚠️権限の不足：再ログインしてください");
                break;
            case "Device is not booting":
                alert("⚠️デバイス取得：スマートフォンからSpotifyを起動してください");
                break;
            default:
                alert("⚠️不明なエラー：再読み込みしてください");
                break;
        }
        console.log(message);
    }

    useEffect(() => {
        const check = setTimeout(async () => {
            if (!token || !isPlay) {
                console.log(`NOT: ${isPlay}`)
                return;
            }
            const res = await fetch(`/api/player/spotify?token=${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (!res.ok) {
                console.log(res)
                return
            }
            const player = await res.json();
            if (!player.is_playing) {
                // もし曲の再生が停止されていたならば、反映させる
                setIsPlay(false);
            } else {
                setIsPlay(true);
                const nextCheckTimeTIme = player.item.duration_ms - player.progress_ms - 2000;
                // 残りの再生時間が3秒未満ならば、次の曲を再生
                if (nextCheckTimeTIme < 3000) {
                    console.log("END");
                    setNowMusic(nextMusic);
                    setNextCheckTime((prev) => prev != 5000 ? 5000 : 5001);
                } else {
                    console.log("SET");
                    setNextCheckTime(nextCheckTimeTIme);
                }
            }
        }, nextCheckTime)
        return () => { clearTimeout(check); }
    }, [nextCheckTime]);

    useEffect(() => {
        async function play() {
            console.log(nowMusic.music.MusicName);
            const res = await fetch("/api/player/spotify", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ action: "play", token, musicID: nowMusic.music.MusicID, userName })
            })
            if (!res.ok) {
                console.log(res);
                showError(res.statusText);
            } else {
                setIsPlay(true);
                setNextCheckTime((prev) => prev != 3000 ? 3000 : 3001);
            }
        }
        if (nowMusic) {
            play();
        }

    }, [nowMusic]);

    return (
        <div className="fixed bottom-0 left-0 w-full h-32 z-50 bg-blue-700 text-white flex items-center px-6">
            <img
                src={nowMusic ? nowMusic.music.ImageUrl : "/image.png"} // 任意の画像に変更
                alt="Song Thumbnail"
                className="w-16 h-16 rounded-md object-cover bg-white"
            />
            <div className="flex-1 ml-4">
                <div className="text-lg font-bold">{nowMusic ? nowMusic.music.MusicName : "Title"}</div>
                <div className="text-sm">{nowMusic ? nowMusic.music.ArtistName : "artist"}</div>
            </div>
            {/* <img src="/play.gif" alt="play" className="w-16 h-8 m-2" /> */}
            {isPlay ? <img src="/play.gif" alt="play" className="w-16 h-8 m-2"></img> : <img src="/pause.png" alt="pause" className="w-16 h-8 m-2"></img>}
            <button
                className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full transition-all duration-1000 overflow-hidden"
                onClick={async () => {
                    setTimeout(() => { setIsDisabled(false) }, 1000);
                    if (isDisabled) { return }
                    setIsDisabled(true);
                    console.log("Click");
                    if (isPlay) {
                        console.log("stop");
                        const res = await fetch("/api/player/spotify", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ action: "pause", token, musicID: "" })
                        })
                        if (res.ok) {
                            setIsPlay(false);
                            console.log("click");
                            setNextCheckTime((prev) => prev != 3000 ? 3000 : 3001);
                        } else {
                            console.log(res);
                            showError(res.statusText);
                        }
                    } else {
                        console.log("restart")
                        setNowMusic({ ...nextMusic });
                    }
                }}
            >
                <span
                    className={`absolute inset-0 bg-black rounded-full transition-transform duration-1000 ${isDisabled ? 'scale-100' : 'scale-0'}`}
                ></span>
                <img
                    src={!isPlay ? "/play-solid.svg" : "pause-solid.svg"}
                    alt="Play Button"
                    className="w-8 h-8"
                />
            </button>
        </div>
    );
}