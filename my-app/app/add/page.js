"use client"

import { useState } from "react";
import axios from "axios";
import "./styles.css"; 
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const router = useRouter();

  const searchTracks = async () => {
    if (!query) return;

    try {
      const response = await axios.get(`/api/search`, {
        params: { query: query }
      });
      setTracks(response.data.tracks);
    } catch (error) {
      console.error("❌ Error fetching tracks:", error.response?.data || error.message);
    }
  };

  const addTrack = async (track) => {
    try {
      // 現在地を取得
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const Latitude = position.coords.latitude;
          const Longitude = position.coords.longitude;
  
          console.log("📍 現在地:", { Latitude, Longitude });
  
          const response = await fetch("/api/tracks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MusicID: track.uri,
              MusicName: track.name,
              ArtistName: track.artists.map((artist) => artist.name).join(", "),
              ImageUrl: track.album.images[0]?.url || null,
              Duration: 0,
              Latitude,
              Longitude,
            }),
          });
  
          const result = await response.json();
          console.log("📥 API Response:", result);
  
          if (response.status === 201) {
            alert(`✅「${track.name}」を追加しました！`);
          } else if (response.status === 409) {
            alert(`⚠️「${track.name}」はすでに登録されています。`);
          } else {
            throw new Error(result.error || "Failed to add track");
          }
        },
        (error) => {
          console.error("❌ 位置情報の取得に失敗:", error);
          alert("⚠️ 位置情報の取得に失敗しました。位置情報を許可してください。");
        }
      );
    } catch (error) {
      console.error("❌ Error saving track:", error);
      alert("⚠️ 曲の追加に失敗しました。");
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => router.push("/player")}>
        ←
      </button>

      <h1 className="title">Search</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="曲名またはアーティスト名を入力"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={searchTracks} className="search-button">検索</button>
      </div>

      {tracks.length > 0 && (
        <ul className="track-list">
          {tracks.map((track) => (
            <li key={track.id} className="track-card">
              <img src={track.album.images[0]?.url} alt={track.name} className="track-image" />
              <div className="track-info">
                <p className="track-title">{track.name}</p>
                <p className="track-artist">{track.artists.map((artist) => artist.name).join(", ")}</p>
                {/* {track.preview_url ? (
                  <audio controls className="track-audio">
                    <source src={track.preview_url} type="audio/mpeg" />
                    ブラウザが audio タグをサポートしていません。
                  </audio>
                ) : (
                  <p className="no-preview">プレビューなし</p>
                )} */}
              </div>
              <button onClick={() => addTrack(track)} className="add-button">＋</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}