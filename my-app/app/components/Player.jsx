export default function Player() {
    return (
        <div className="fixed bottom-0 left-0 w-full h-32 bg-blue-900 text-white flex items-center px-6">
            {/* 曲のアイコン */}
            <img
                src="https://nureyon.com/sample/8/upper_body-2-p16.svg?1712240455" // 任意の画像に変更
                alt="Song Thumbnail"
                className="w-16 h-16 rounded-md object-cover bg-white"
            />
        </div>
    );
}