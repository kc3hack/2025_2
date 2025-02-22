"use client"
import { useSession } from "next-auth/react"
import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import { kdTree } from 'kd-tree-javascript';

export default function Home() {
    const { data: session } = useSession();
    const token = session?.token?.access_token;

    const [currentPosition, setCurrentPosition] = useState([35.0127, 135.7094305]);
    const [musicList, setMusicList] = useState([]);
    const [currentBlockNo, setCurrentBlockNo] = useState(0);
    const [nearestMusicSpot, setNearestMusicSpot] = useState(null);

    /* 現在のBlockNoにある音楽を取得する */
    async function fetchMusic(blockNo) {
        const res = await fetch(`/api/player?blockNo=${blockNo}`);
        const musicData = await res.json();
        // console.log("musics:", musicData); //デバッグ用
        return musicData;
    }

    const SimpleMap = useMemo(
        () =>
            dynamic(() => import('./simpleMap'), {
                loading: () => <p>map loading...</p>,
                ssr: false,
            }),
        []
    );

    /* 緯度経度からBlockNoを計算する */
    function calculateBlockNo(latitude, longitude) {
        return (Math.floor((latitude + 90) / 0.01) * 2700 + Math.floor((longitude + 180) / 0.01));
    }

    /* コンポーネントがレンダリングされたときに実行される */
    useEffect(() => {
        // console.log("Start"); //デバッグ用
        /* 繰り返されて実行される関数 */
        const updateLocation = setInterval(() => {
            // console.log("hello"); //デバッグ用
            /* 現在地の緯度経度からBlockNumや最も近いスポットの更新、CollectionTableへの登録をする */
            navigator.geolocation.getCurrentPosition(async (position) => {
                /* 現在地の緯度経度を取得する */
                const newPosition = [position.coords.latitude, position.coords.longitude]; //新たな現在地情報の緯度と経度を取得
                console.log("現在地:", newPosition); //新たな現在地を表示
                setCurrentPosition(newPosition); //現在地を更新

                /* 現在地からBlockNoを計算、更新する */
                const newBlockNo = calculateBlockNo(newPosition[0], newPosition[1]); //現在地のBlockNoを計算
                // console.log("newBlockNo", newBlockNo); //デバッグ用
                if (newBlockNo !== currentBlockNo) { //BlockNoが変化した場合
                    setCurrentBlockNo(newBlockNo); //BlockNoを更新
                    const musicData = await fetchMusic(newBlockNo); //BlockNoにある音楽を新たに取得
                    setMusicList(musicData); //BlockNoにある音楽を更新
                    // console.log("musics", musicData); //デバッグ用
                }

                /* kdtreeを使った最短距離の計算 */
                const distance = (a, b) => {
                    return calculateVincentyDistance(a.Latitude, a.Longitude, b.Latitude, b.Longitude);
                };
                const tree = new kdTree(musicList, distance, ["Latitude", "Longitude"]);
                const nearest = tree.nearest({ Latitude: newPosition[0], Longitude: newPosition[1] }, 1);
                if (nearest.length > 0) {
                    const closestMusic = nearest[0][0];
                    if (nearestMusicSpot !== closestMusic) {
                        console.log("最も近いスポット", closestMusic); //デバッグ用
                        setNearestMusicSpot(closestMusic);
                    }
                }

            }, (error) => {
                console.log("Geolocation error:", error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.error("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.error("An unknown error occurred.");
                        break;
                }
            }, { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }); // 現在位置を常に正確に取得し、1000ms以内に取得できないとエラーとなる
        }, 1000); //1000ms(1s)毎に繰り返す
        return () => clearInterval(updateLocation); //コンポーネントがアンマウントされたときにsetIntervalの中身を消去
    }, [currentBlockNo, musicList, nearestMusicSpot, currentPosition]); //currentBlockNo, musicList, nearestMusicSpot, currentPositionに依存して実行される

    /* 以下、距離計算のための関数 */
    /* 度からラジアンに */
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /* Vincenty法 */
    function calculateVincentyDistance(lat1, lon1, lat2, lon2) { //始点の緯度・経度、終点の緯度・経度から計算
        const a = 6378137.0; // WGS-84 長半径（赤道半径）（メートル）
        const f = 1 / 298.257223563; // 扁平率
        const b = (1 - f) * a; //短半径を計算

        const φ1 = toRadians(lat1); //始点の緯度をラジアンに
        const φ2 = toRadians(lat2); //終点の緯度をラジアンに
        const L = toRadians(lon2 - lon1); //経度差をラジアンに

        const U1 = Math.atan((1 - f) * Math.tan(φ1)); //修正された始点の緯度を計算
        const U2 = Math.atan((1 - f) * Math.tan(φ2)); //修正された終点の緯度を計算
        const sinU1 = Math.sin(U1); //修正された始点の緯度の正弦と
        const cosU1 = Math.cos(U1); //余弦を計算
        const sinU2 = Math.sin(U2); //修正された終点の緯度の正弦と
        const cosU2 = Math.cos(U2); //余弦を計算

        let λ = L; //初期方位格差を初期化
        let λP; //前の方位角差の変数を初期化
        let iterLimit = 100; //反復計算の上限を設定
        let cosSqα, sinσ, cos2σM, cosσ, σ; //中間計算のための変数を初期化

        /* 反復計算 */
        do {
            const sinλ = Math.sin(λ); //方位角の正弦と
            const cosλ = Math.cos(λ); //余弦を計算
            sinσ = Math.sqrt((cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ)); //修正された距離の正弦を計算
            if (sinσ === 0) return 0; //共通点の場合の処理
            cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ; //修正された距離の余弦を計算
            σ = Math.atan2(sinσ, cosσ); //距離を計算
            const sinα = cosU1 * cosU2 * sinλ / sinσ; //緯度の正弦を計算
            cosSqα = 1 - sinα * sinα; //緯度の余弦の二乗を計算
            cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα; //中間計算
            if (isNaN(cos2σM)) cos2σM = 0; // 赤道の場合
            const C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα)); //中間計算
            λP = λ; //前の方位角差の更新
            λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM))); //新しい方位角差を計算
        } while (Math.abs(λ - λP) > 1e-12 && --iterLimit > 0); //誤差が収束するか、反復上限を満たすまで反復

        if (iterLimit === 0) return NaN; // 誤差が収束しなかった場合

        /* 距離sを求めるための諸計算 */
        const uSq = cosSqα * (a * a - b * b) / (b * b);
        const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        const Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) - B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

        const s = b * A * (σ - Δσ); //距離sを計算
        console.log("現在地との距離", s/1000 + "km"); //デバッグ用
        return s;
    }


    return (
        <>
            <SimpleMap position={currentPosition} musics={musicList} />
            {/* デバッグ用ボタン */}
            <button className="b-0" onClick={() => {
                console.log("Click");
                setBlockno(0);
            }}>再読み込み</button>
        </>
    )
}