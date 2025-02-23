"use client"; // クライアントサイドで動作するコンポーネントであることを指定

import { useState, useEffect } from "react"; // React の状態管理と副作用処理のためのフックをインポート
import { useSession } from "next-auth/react"; // NextAuth のセッション管理用フックをインポート
import { useRouter } from "next/navigation"; // クライアントサイドのルーティング用フックをインポート
import "./styles.css"; // スタイルシートをインポートして UI をデザイン

export default function Home() {
    // NextAuth から現在のセッション情報を取得（ログイン状態やユーザー情報）
    const { data: session } = useSession();
    // 検索ワードを管理するための状態（初期値は空文字列）
    const [searchQuery, setSearchQuery] = useState("");
    // 取得した曲データを保持する状態（初期値は空配列）
    const [songs, setSongs] = useState([]);
    // ページ遷移を管理するためのルーターオブジェクト
    const router = useRouter();
    // セッショントークンからアクセストークンを取得（認証用、オプショナルチェイニングで安全にアクセス）
    const token = session?.token?.access_token;

    // 初回レンダリング時またはセッション変更時にデータ取得を実行
    useEffect(() => {
        // ユーザーがログインしていない場合（email がない場合）は何もしない
        if (!session?.user?.email) return;
        fetchData(); // 初期データを取得
    }, [session]); // session が変更されるたびに実行

    // サーバーから曲データを取得する非同期関数
    const fetchData = async (query = "") => {
        try {
            // API にリクエストを送信（メールアドレスと検索クエリをクエリパラメータとして渡す）
            const res = await fetch(`/api/collectiondb?email=${session.user.email}&query=${query}`);
            // レスポンスが正常でない場合（200-299以外）にエラーをスロー
            if (!res.ok) {
                throw new Error(`データの取得に失敗しました (ステータス: ${res.status})`);
            }
            // レスポンスを JSON 形式でパース
            const json = await res.json();
            // 取得したデータを songs 状態にセット
            setSongs(json);
        } catch (error) {
            // エラーが発生した場合、コンソールに記録
            console.error("Failed to fetch data:", error);
            // ユーザーにエラーをアラートで通知
            alert("⚠️データの取得に失敗しました");
            // エラー時は songs を空にリセット
            setSongs([]);
        }
    };

    // 検索ボタンがクリックされたときに呼び出される関数
    const handleSearch = () => {
        fetchData(searchQuery); // 検索クエリを渡してデータ取得
    };

    // 曲名がクリックされたときに呼び出される関数（musicId を受け取る）
    const handleMusicClick = async (musicId) => {
        try {
            // EntryID を取得するために API にリクエスト
            const response = await fetch(`/api/get_entryID?musicId=${encodeURIComponent(musicId)}`);
            // レスポンスが正常でない場合にエラーをスロー
            if (!response.ok) {
                throw new Error(`EntryID の取得に失敗しました (ステータス: ${response.status})`);
            }
            // レスポンスを JSON 形式でパース
            const data = await response.json();
            // entryId が存在する場合
            if (data.entryId) {
                // プレイヤーページに遷移（クエリパラメータとして entryId を渡す）
                router.push(`/player?entryId=${data.entryId}`);
            } else {
                // entryId がない場合にエラーをスロー
                throw new Error("EntryID not found");
            }
        } catch (error) {
            // エラーが発生した場合、コンソールに記録
            console.error("Error fetching entry ID:", error);
            // ユーザーにエラーをアラートで通知
            alert("⚠️この曲の追加IDデータの取得に失敗しました");
        }
    };

    // UI をレンダリング
    return (
        // 全体を包むコンテナ（CSS クラスでスタイル適用）
        <div className="container">
            // ページの見出し
            <h1 className="title">Collections</h1>
            // 検索フォームを包むコンテナ
            <div className="search-box">
                // 検索ワードを入力するテキストボックス
                <input
                    type="text"
                    placeholder="曲名またはアーティスト名を入力" // プレースホルダーテキスト
                    value={searchQuery} // 入力値を状態に紐づけ
                    onChange={(e) => setSearchQuery(e.target.value)} // 入力変更時に状態を更新
                    className="search-input" // スタイル適用
                />
                // 検索ボタン
                <button onClick={handleSearch} className="search-button">検索</button>
            </div>
            // songs 配列にデータがある場合にリストを表示
            {songs.length > 0 ? (
                // トラックリスト（順序なしリスト）
                <ul className="track-list">
                    // songs 配列をマッピングして各曲を表示
                    {songs.map((song, index) => (
                        // 各トラックをカード形式で表示
                        <li key={index} className="track-card">
                            // 曲のアルバム画像
                            <img src={song.music.ImageUrl} alt={song.music.MusicName} className="track-image" />
                            // 曲情報（曲名と解放日）を包むコンテナ
                            <div className="track-info">
                                // 曲名（クリック可能なリンク）
                                <h3 className="track-title">
                                    <a
                                        href="#" // デフォルトリンク（実際には遷移しない）
                                        onClick={(e) => {
                                            e.preventDefault(); // デフォルトのリンク動作をキャンセル
                                            handleMusicClick(song.music.MusicID); // クリック時に遷移処理
                                        }}
                                        className="track-title-link" // リンクスタイル適用
                                    >
                                        {song.music.MusicName} // 曲名を表示
                                    </a>
                                </h3>
                                // 解放日をローカル日付形式で表示
                                <p className="track-artist">{new Date(song.Unlocked).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // データがない場合に表示するメッセージ
                <p>データがありません</p>
            )}
        </div>
    );
}