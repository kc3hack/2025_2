"use client"
// import { useSession } from "next-auth/react"
// import { useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [query, setQuery] = useState("");
//   const [tracks, setTracks] = useState([]);

//   const { data: session } = useSession();
//   const token = session?.token?.access_token;

//   const searchTracks = async () => {
//     if (!query) return;

//     try {
//       // const response = await axios.get(`/api/search?query=${query}`);
//       const response = await fetch(`/api/search`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token, query }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch tracks");
//       }
//       const data = await response.json();
//       setTracks(data.tracks);
//       // setTracks(response.data.tracks.items);
//     } catch (error) {
//       console.error("Error fetching tracks:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Seach</h1>
//       <input
//         type="text"
//         placeholder="曲名またはアーティスト名"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <button onClick={searchTracks}>検索</button>

//       {tracks.length > 0 && (
//         <ul>
//           {tracks.map((track) => (
//             <li key={track.id}>
//               <img src={track.album.images[0]?.url} alt={track.name} width={50} />
//               <p>{track.name} - {track.artists.map((artist) => artist.name).join(", ")}</p>
//               <audio controls>
//                 <source src={track.preview_url} type="audio/mpeg" />
//                 ブラウザが audio タグをサポートしていません。
//               </audio>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import "./styles.css"; 

export default function Home() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);

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

  const addTrack = (track) => {
    console.log("🎵 追加された曲:", track);
    alert(`「${track.name}」を追加しました`);
  };

  return (
    <div className="container">
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