"use client"
import { useSession } from "next-auth/react"
import { useState } from "react";
import axios from "axios";

// export default function Home() {
//     const { data: session } = useSession();
//     console.log(session);
//     const token = session?.token?.access_token;

//     return (
//         <>
//             <p>曲を登録するページ</p>
//         </>
//     )
// }

export default function Home() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);

  const searchTracks = async () => {
    if (!query) return;

    try {
      const response = await axios.get(`/api/search?query=${query}`);
      setTracks(response.data.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <div>
      <h1>Seach</h1>
      <input
        type="text"
        placeholder="曲名またはアーティスト名"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchTracks}>検索</button>

      {tracks.length > 0 && (
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              <img src={track.album.images[0]?.url} alt={track.name} width={50} />
              <p>{track.name} - {track.artists.map((artist) => artist.name).join(", ")}</p>
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
                ブラウザが audio タグをサポートしていません。
              </audio>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}