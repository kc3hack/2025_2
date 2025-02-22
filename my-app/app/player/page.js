// "use client"
// import { useSession } from "next-auth/react"
// import { useRouter } from 'next/router'

// export default function Home() {
//     const { data: session } = useSession();
//     console.log(session);
//     const token = session?.token?.access_token;

//     return (
//         <>
//             <p>再生するページ</p>
//         </>
//     )
// }
"use client";

import { useSearchParams } from "next/navigation";

export default function PlayerPage() {
    const searchParams = useSearchParams();
    const entryId = searchParams.get("entryId");

    if (!entryId) {
        return <div>EntryID が指定されていません</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>音楽プレイヤー</h1>
            <p>EntryID: {entryId}</p>
            {/* ここに再生機能や追加データを表示するロジックを追加 */}
        </div>
    );
}