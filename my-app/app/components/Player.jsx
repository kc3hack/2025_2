"use client"
import { useEffect } from "react";

export default function Player() {
    // ここで現在、再生中
    return (
        <div className="fixed bottom-0 left-0 w-full h-32 bg-blue-900 text-white flex items-center px-6">
            {/* 曲のアイコン */}
            <img
                src="https://nureyon.com/sample/8/upper_body-2-p16.svg?1712240455" // 任意の画像に変更
                alt="Song Thumbnail"
                className="w-16 h-16 rounded-md object-cover bg-white"
            />
            <div className="flex-1 ml-4">
                {/* 曲名 */}
                <div className="text-lg font-bold">Song Title</div>
                {/* アーティスト名 */}
                <div className="text-sm">Artist Name</div>
            </div>
            {/* 再生ボタン */}
            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img
                    src="play-solid.svg"
                    alt="Play Button"
                    className="w-8 h-8"
                />
            </button>
        </div>
    );
}