"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./styles.css"; // スタイルを適用

export default function Home() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [songs, setSongs] = useState([]);
    const router = useRouter();
    const token = session?.token?.access_token;

    useEffect(() => {
        if (!session?.user?.email) return;
        fetchData();
    }, [session]);

    const fetchData = async (query = "") => {
        try {
            const res = await fetch(`/api/collectiondb?email=${session.user.email}&query=${query}`);
            const json = await res.json();
            setSongs(json);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const handleSearch = () => {
        fetchData(searchQuery);
    };
    
    const handleMusicClick = async (musicId) => {
        try {
            const response = await fetch(`/api/get_entryID?musicId=${encodeURIComponent(musicId)}`);
            const data = await response.json();
            if (data.entryId) {
                router.push(`/player?entryId=${data.entryId}`);
            } else {
                throw new Error("EntryID not found");
            }
        } catch (error) {
            console.error("Error fetching entry ID:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Collections</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="曲名またはアーティスト名を入力"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">検索</button>
            </div>
            {songs.length > 0 ? (
                <ul className="track-list">
                    {songs.map((song, index) => (
                        <li key={index} className="track-card">
                            <img src={song.music.ImageUrl} alt={song.music.MusicName} className="track-image" />
                            <div className="track-info">
                                <h3 className="track-title">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleMusicClick(song.music.MusicID);
                                        }}
                                        className="track-title-link"
                                    >
                                        {song.music.MusicName}
                                    </a>
                                </h3>
                                <p className="track-artist">{new Date(song.Unlocked).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>データがありません</p>
            )}
        </div>
    );
}
