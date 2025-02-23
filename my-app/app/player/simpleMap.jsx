import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useRouter } from "next/navigation";

const defaultPosition = [34.81763, 135.36189];

function DynamicMarker({ position }) {
  const map = useMap();
  const [iconSize, setIconSize] = useState([25, 35]);

  useEffect(() => {
    const updateIconSize = () => {
      const zoom = map.getZoom();
      if (zoom < 10) {
        setIconSize([0, 0]);
      } else {
        setIconSize([zoom * 1.5, zoom * 2]);
      }
    };

    map.on('zoomend', updateIconSize);
    updateIconSize();

    return () => {
      map.off('zoomend', updateIconSize);
    };
  }, [map]);

  const musicIcon = L.icon({
    iconUrl: 'https://img.icons8.com/?size=100&id=qJaxRD3kNRPO&format=png&color=000000',
    iconSize,
    iconAnchor: [12, 41],
  });

  return (
    <Marker position={position} icon={musicIcon}>
      <Popup>曲名</Popup>
    </Marker>
  );
}
function RecenterMap({ position, isFollowing }) {
  const map = useMap();

  useEffect(() => {
    if (position && isFollowing) {
      map.setView(position, map.getZoom());
    }
  }, [position, isFollowing, map]);

  return null;
}

export default function CurrentLocationMap({ position, musics }) {
  const [isFollowing, setIsFollowing] = useState(true); // 追従モードの管理
  const router = useRouter();

  // 現在地アイコンの設定
  const myIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (!position) {
    return <div>位置情報を取得中...</div>; // 位置情報が取得されるまでの表示
  }

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={position} zoom={13} style={{ height: 'calc(100vh - 128px)', width: '100%' }}>
        <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
        <RecenterMap position={position} isFollowing={isFollowing} />
        <Marker position={position} icon={myIcon}>
          <Popup>現在地</Popup>
        </Marker>

        {/* DynamicMarker コンポーネントを使用 */}
        {Array.isArray(musics) ? musics.map((music, i) => (
          <DynamicMarker key={i} position={[music.Latitude, music.Longitude]} />
        )) : null}

      </MapContainer>

      {/* 追従モードの切り替えボタン */}
      <button
        onClick={() => setIsFollowing(!isFollowing)}
        style={{
          position: "absolute",
          top: "20px",
          right: "10px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {isFollowing ? "追従ON" : "追従OFF"}
      </button>

      {/* 追加ページボタン（画面遷移） */}
      <button
        onClick={() => router.push("/add")}
        style={{
          position: "absolute",
          bottom: "50px",
          right: "10px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        }}
      >
        +
      </button>

      {/* コレクションページ（画面遷移） */}
      <button
        onClick={() => router.push("/collection")}
        style={{
          position: "absolute",
          bottom: "50px",
          left: "10px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        }}
      >
        ≡
      </button>
    </div>
  );
}
