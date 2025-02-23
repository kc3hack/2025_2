"use client"; // クライアントコンポーネントとして実行

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // 認証情報を取得するためのフック
import { useRouter } from "next/navigation"; // ページ遷移用のルーター
import "./styles.css"; // スタイルの適用

export default function Home() {
    const { data: session } = useSession(); // ユーザーのセッション情報を取得
    const [searchQuery, setSearchQuery] = useState(""); // 検索クエリの状態を管理
    const [songs, setSongs] = useState([]); // 取得した曲データを管理

    const router = useRouter(); // ルーターの初期化
    const token = session?.token?.access_token; // 認証トークン（未使用）

    useEffect(() => {
        // ユーザーのメールアドレスが取得できたらデータを取得
        if (!session?.user?.email) return;
        fetchData();
    }, [session]);

    // データを取得する関数
    const fetchData = async (query = "") => {
        try {
            // APIエンドポイントに検索クエリとユーザーのメールアドレスを渡す
            const res = await fetch(`/api/collectiondb?email=${encodeURIComponent(session.user.email)}&query=${encodeURIComponent(query)}&sort=desc`);
            const json = await res.json(); // JSONレスポンスを取得
            setSongs(json); // 取得したデータを状態にセット
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("⚠️データの取得に失敗しました");
            setSongs([]); // エラー時は曲リストを空にする
        }
    };

    // 検索ボタンを押したときに検索を実行
    const handleSearch = () => {
        fetchData(searchQuery);
    };

    // 曲をクリックしたときに詳細ページへ遷移する処理
    const handleMusicClick = async (musicId) => {
        try {
            // 選択した曲の EntryID を取得するAPIを呼び出し
            const response = await fetch(`/api/get_entryID?musicId=${encodeURIComponent(musicId)}&sort=desc`);
            const data = await response.json();
            
            // EntryIDが取得できた場合、プレイヤーページへ遷移
            if (data.entryId) {
                router.push(`/player?entryId=${data.entryId}`);
            } else {
                throw new Error("EntryID not found");
            }
        } catch (error) {
            console.error("Error fetching entry ID:", error);
            alert("⚠️この曲の追加IDデータの取得に失敗しました");
        }
    };

    return (
        <div className="container">
            <h1 className="title">Collections</h1>

            {/* 検索ボックス */}
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

            {/* 取得した曲リストの表示 */}
            {songs.length > 0 ? (
                <ul className="track-list">
                    {songs.map((song, index) => (
                        <li key={index} className="track-card">
                            {/* 曲の画像 */}
                            <img src={song.music.ImageUrl} alt={song.music.MusicName} className="track-image" />

                            {/* 曲情報 */}
                            <div className="track-info">
                                <h3 className="track-title">
                                    {/* クリックで詳細ページへ遷移 */}
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
                                {/* 曲のアンロック日を表示 */}
                                <p className="track-artist">{new Date(song.Unlocked).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>データがありません</p> // 曲が見つからなかった場合の表示
            )}
        </div>
    );
}