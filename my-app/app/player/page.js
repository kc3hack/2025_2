"use client"
import { useSession } from "next-auth/react"
import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import Player from '../components/Player';
import { kdTree } from 'kd-tree-javascript';

const path = [
    [34.99606, 135.73869],
    [34.99603, 135.74078],
    [34.99300, 135.74075],
    [34.99303, 135.73647],
    [34.99597, 135.73656]
];

const stepSize = 0.0001; // 移動ステップの距離（度単位）

export default function Home() {
    const { data: session } = useSession();
    const token = session?.token?.access_token;
    const userName = session?.user.email;

    const [position, setPosition] = useState([35.0127, 135.7094305]);
    const [musics, setMusics] = useState([]);
    const [blockNo, setBlockno] = useState(0);
    const [closestSpot, setClosestSpot] = useState(null);
    const [tree, setTree] = useState(null);

    /* blockNoにある音楽をGETする */
    async function getMusic(blockNo) {
        const res = await fetch(`/api/player?blockNo=${blockNo}`);
        const musics = await res.json();
        console.log("musics:", musics); //デバッグ用
        return musics;
    }

    const SimpleMap = useMemo(
        () =>
            dynamic(() => import('./simpleMap'), {
                loading: () => <p>map loading...</p>,
                ssr: false,
            }),
        []
    );

    /* BlockNoを計算する */
    function calcBlockNo(Latitude, Longitude) {
        return (Math.floor((Latitude + 90) / 0.01) * 2700 + Math.floor((Longitude + 180) / 0.01));
    }

    /* a,b間の距離を計算する */
    function calcDistance(a, b) {
        return calculateVincentyDistance(a.Latitude, a.Longitude, b.Latitude, b.Longitude);
    }
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
        return s;
    }

    useEffect(() => {
        if (musics.length > 0) {
            setTree(new kdTree(musics, calcDistance, ["Latitude", "Longitude"]));
        }
    }, [musics]);
    useEffect(() => {
        if (!tree || !position) return;

        let newClosestSpot = tree.nearest({ Latitude: position[0], Longitude: position[1] }, 1);
        if (newClosestSpot.length > 0 && JSON.stringify(newClosestSpot[0][0]) !== JSON.stringify(closestSpot)) {
            console.log("new:", newClosestSpot[0][0])
            setClosestSpot(newClosestSpot[0][0]);
        }
    }, [tree, position])
    // useEffect(() => {
    //     /* 繰り返されて実行される関数 */
    //     const loop = setInterval(() => {
    //         navigator.geolocation.getCurrentPosition(async (posi) => {
    //             /* 現在地の緯度経度を取得する */
    //             const newPosition = [posi.coords.latitude, posi.coords.longitude];
    //             setPosition(newPosition); //現在地を更新
    //             // console.log("newPosition:", newPosition); //新たな現在地を表示

    //             /* 現在地からBlockNoを計算、更新する */
    //             const newBlockNo = calcBlockNo(newPosition[0], newPosition[1]);
    //             if (newBlockNo !== blockNo) { //BlockNoが変化した場合
    //                 setBlockno(newBlockNo); //BlockNoを更新
    //                 /* BlockNoから周囲の楽曲を取得 */
    //                 const musics = await getMusic(newBlockNo);
    //                 setMusics(musics); //BlockNoにある音楽を更新
    //             }
    //             // console.log("newBlockNo", newBlockNo); //デバッグ用
    //             // console.log("musics",musics); //デバッグ用

    //         }, (error) => {
    //             if (error.code == 2) {
    //                 clearInterval(loop);
    //                 alert("⚠️ 位置情報の取得に失敗しました。");
    //             }
    //         }, { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }); // 現在位置を常に正確に取得し、1000ms以内に取得できないとエラーとなる
    //     }, 5000); //1000ms(1s)毎に繰り返す

    //     return () => clearInterval(loop); //コンポーネントがアンマウントされたときにsetIntervalの中身を消去
    // }, [blockNo, musics]);
    useEffect(() => {
        let index = 0; // 現在の経路インデックス
        let currentPosition = [...path[0]]; // 現在の位置

        /* 位置を更新する関数 */
        function moveToNextPoint() {
            if (index >= path.length - 1) return; // 経路の最後に到達したら停止

            const [latA, lonA] = path[index];   // 現在のポイント
            const [latB, lonB] = path[index + 1]; // 次のポイント
            const dx = lonB - lonA;
            const dy = latB - latA;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.ceil(distance / stepSize);
            const stepX = dx / steps;
            const stepY = dy / steps;

            let currentStep = 0;

            const interval = setInterval(async () => {
                if (currentStep >= steps) {
                    clearInterval(interval);
                    index++;
                    moveToNextPoint(); // 次のポイントへ移動
                    return;
                }

                currentPosition[0] += stepY;
                currentPosition[1] += stepX;
                setPosition([...currentPosition]); // 位置を更新

                /* BlockNoの計算と更新 */
                setBlockno((prevBlockNo) => {
                    const newBlockNo = calcBlockNo(currentPosition[0], currentPosition[1]);
                    if (newBlockNo !== prevBlockNo) {
                        getMusic(newBlockNo).then((musics) => setMusics(musics));
                        return newBlockNo;
                    }
                    return prevBlockNo;
                });

                currentStep++;
            }, 1000); // 1秒ごとに移動
        }

        moveToNextPoint(); // 最初の移動を開始

        return () => clearInterval(); // クリーンアップ
    }, []);


    return (
        <>
            <SimpleMap position={position} musics={musics} nextMusic={closestSpot} />
            <Player nextMusic={closestSpot} token={token} userName={userName} />
            {/* デバッグ用ボタン */}
            <button className="b-0" onClick={() => {
                console.log("Click");
                setBlockno(0);
            }}>再読み込み</button>
        </>
    )
}