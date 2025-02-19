import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const defaultPosition = [34.81763, 135.36189]; // 

function DynamicMarker({ position }) {
  const map = useMap();

  const [iconSize, setIconSize] = useState([25, 35]); // 初期アイコンサイズ

  useEffect(() => {
    const updateIconSize = () => {
      const zoom = map.getZoom();
      // ズームが10未満ならアイコンを非表示にする
      if (zoom < 17) {
        setIconSize([0, 0]);  // アイコンサイズをゼロにして消す
      } else {
        // ズームレベルに応じてアイコンサイズを変更
        setIconSize([zoom * 1.5, zoom * 2]);  // ズームに基づいてアイコンサイズを調整
      }
    };


    map.on('zoomend', updateIconSize);  // ズーム終了時にサイズを更新
    updateIconSize();  // 初期化時にサイズを設定

    return () => {
      map.off('zoomend', updateIconSize);  // クリーンアップ
    };
  }, [map]);

  // ミュージックアイコン設定
  const musicIcon = L.icon({
    iconUrl: 'https://img.icons8.com/?size=100&id=qJaxRD3kNRPO&format=png&color=000000',
    iconSize,
    iconAnchor: [12, 41],
  });

  return (
    <Marker position={position} icon={musicIcon} minZoom={10} maxZoom={15}>
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

export default function CurrentLocationMap() {
  const [position, setPosition] = useState(null);
  const [isFollowing, setIsFollowing] = useState(true); // 追従モードの管理

  useEffect(() => {
    if ("geolocation" in navigator) {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log("位置情報を取得しました:", latitude, longitude);
            setPosition([latitude, longitude]); // 現在地が取得できたら位置を更新
          },
          (error) => {
            console.error("位置情報を取得できませんでした:", error);
          }
        );
      }, 1000);
    } else {
      console.error("このブラウザはGeolocationに対応していません");
    }
  }, []);

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
        <DynamicMarker position={position} />
      </MapContainer>

      {/* 追従モードの切り替えボタン */}
      <button
        onClick={() => setIsFollowing(!isFollowing)}
        style={{
          position: "absolute",
          bottom: "20px",
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
    </div>

  );
}
