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
        const s = Math.sqrt((a.latitude - b.latitude) ** 2 + (a.longitude - b.longitude) ** 2);
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
        if (newClosestSpot.length > 0 && newClosestSpot[0][0]?.music?.MusicID !== closestSpot?.music?.MusicID) {
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