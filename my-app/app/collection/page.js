"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // 画面遷移のために追加

export default function Home() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState(""); // 検索ワードを管理
    const [songs, setSongs] = useState([]);
    const router = useRouter(); // Next.js のルーターを追加
    console.log(session);
    const token = session?.token?.access_token;

    // ユーザーがログインしている場合のみ実行
    useEffect(() => {
        if (!session?.user?.email) return; // ユーザーが未ログインなら実行しない
        fetchData(); // 初回読み込み時にデータを取得
    }, [session]);

    // データを取得する関数
    const fetchData = async (query = "") => {
        try {
            // クエリパラメータとして検索ワードを渡す
            const res = await fetch(`/api/collectiondb?email=${session.user.email}&query=${query}`);
            const json = await res.json();
            setSongs(json); // 🔹 取得したデータをセット
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    // 検索ボタンを押した時の処理
    const handleSearch = () => {
        fetchData(searchQuery); // 検索ワードを渡してデータを取得
    };
    
    // 曲名クリック時の処理
    const handleMusicClick = async (musicId) => {
        try {
            const response = await fetch(`/api/get_entryID?musicId=${encodeURIComponent(musicId)}`);
            const data = await response.json();
            console.log("Fetched entryID:", data); // デバッグ用
            if (data.entryId) {
                // プレイヤー画面に遷移
                router.push(`/player?entryId=${data.entryId}`);
            } else {
                throw new Error("EntryID not found");
            }
        } catch (error) {
            console.error("Error fetching entry ID:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
             {/* 検索フォーム */}
             <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="検索ワードを入力"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // 入力された検索ワードを更新
                    style={{
                        padding: "8px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        border: "1px solid #ccc"
                    }}
                />
                <button
                    onClick={handleSearch} // 検索ボタンがクリックされた時にデータを取得
                    style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    検索
                </button>
            </div>
            {songs.length > 0 ? (
                songs.map((song, index) => (
                    <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "5px",
                        border: "3px solid #e9e9e9",
                        padding: "10px",
                        borderRadius: "6px",
                        width: "95%",
                        maxWidth: "600px",
                        backgroundColor: "#e9e9e9"
                    }}>
                        {/* 画像 */}
                        <img src={song.music.ImageUrl} alt={song.music.MusicName} 
                            style={{ width: "32px", height: "32px", borderRadius: "8px" }} 
                        />
                        
                        {/*曲名と解放日*/}
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            width: "100%" 
                        }}>
                            <h3 style={{ margin: "0", fontSize: "18px" }}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleMusicClick(song.music.MusicID);
                                    }}
                                    style={{ textDecoration: "underline", color: "#0070f3", cursor: "pointer" }}
                                >
                                    {song.music.MusicName}
                                </a>
                            </h3>
                            <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
                                {new Date(song.Unlocked).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>データがありません</p>
            )}
        </div>
    );
}