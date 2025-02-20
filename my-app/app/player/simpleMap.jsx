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
      if (zoom < 17) {
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

export default function CurrentLocationMap() {
  const [position, setPosition] = useState(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    if ("geolocation" in navigator) {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log("位置情報を取得しました:", latitude, longitude);
            setPosition([latitude, longitude]);
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

  const myIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (!position) {
    return <div>位置情報を取得中...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
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

      {/* + ボタン（画面遷移） */}
      <button
        onClick={() => router.push("/add")}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "10px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        }}
      >
        +
      </button>

      {/* + ボタン（画面遷移） */}
      <button
        onClick={() => router.push("/collection")}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "10px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        }}
      >
        ≡
      </button>
    </div>
  );
}
