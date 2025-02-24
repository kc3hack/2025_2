"use client"; // クライアントコンポーネントとして実行

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // 認証情報を取得するためのフック
import { useRouter } from "next/navigation"; // ページ遷移用のルーター
import Player from '../components/Player';
import "./styles.css"; // スタイルの適用

export default function Home() {
    const { data: session } = useSession(); // ユーザーのセッション情報を取得
    const [searchQuery, setSearchQuery] = useState(""); // 検索クエリの状態を管理
    const [songs, setSongs] = useState([]); // 取得した曲データを管理
    const [playMusic, setPlayMusic] = useState(null);
    const [sortOrder, setSortOrder] = useState("desc");

    const router = useRouter(); // ルーターの初期化
    const token = session?.token?.access_token; // 認証トークン（未使用）
    const userName = session?.user?.email;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ユーザーのメールアドレスが取得できたらデータを取得
        if (!session?.user?.email) return;
        fetchData();
    }, [session]);

    // データを取得する関数
    const fetchData = async (query = "", order = sortOrder) => {
        try {
            setLoading(true);//ローディング用
            // APIエンドポイントに検索クエリとユーザーのメールアドレスを渡す
            const res = await fetch(`/api/collectiondb?email=${encodeURIComponent(session.user.email)}&query=${encodeURIComponent(query)}&sort=${order}`);
            const json = await res.json(); // JSONレスポンスを取得
            setSongs(json); // 取得したデータを状態にセット
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("⚠️データの取得に失敗しました");
            setSongs([]); // エラー時は曲リストを空にする
        } finally {
            setLoading(false);//ローディング用
          }
    };

    // 検索ボタンを押したときに検索を実行
    const handleSearch = () => {
        try{
            setLoading(true);//ローディング用
            fetchData(searchQuery);
        } finally {
            setLoading(false);//ローディング用
          }
    };

     // ソート順を切り替える処理
     const toggleSortOrder = () => {
        const newOrder = sortOrder === "desc" ? "asc" : "desc";
        setSortOrder(newOrder);
        fetchData(searchQuery, newOrder); // ソート切り替え時にデータ再取得
    };

    // 曲をクリックしたときに詳細ページへ遷移する処理
    const handleMusicClick = async (musicId) => {
        try {
            setLoading(true);//ローディング用
            // 選択した曲を MusicIDから取得する
            const response = await fetch(`/api/get_music?musicId=${encodeURIComponent(musicId)}&sort=desc`);
            const data = await response.json();

            setPlayMusic(data);
        } catch (error) {
            console.error("Error fetching entry ID:", error);
            alert("⚠️再生データの取得に失敗しました");
        } finally {
            setLoading(false);//ローディング用
          }
    };

    return (
        <>
            <div className="container">
                <button className="back-button" onClick={() => router.push("/player")}>
                    ←
                </button>
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
                {/* ソート切り替えボタン */}
                {songs.length > 0 && (
                <div className="sort-button-container">
                    <button onClick={toggleSortOrder} className="sort-button">
                        {sortOrder === "desc" ? "new" : "old"}
                    </button>
                </div>
                )}

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
            <Player nextMusic={playMusic} token={token} userName={userName} />
        </>
    );
}