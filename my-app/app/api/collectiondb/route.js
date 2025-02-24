import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient(); // Prismaクライアントを作成

// GETリクエストの処理
export async function GET(req) {
    try {
        // クエリパラメータから email, query, sort を取得
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email"); // ユーザーのメールアドレス
        const query = searchParams.get("query"); // 検索クエリ（曲名またはアーティスト名）
        const sort = searchParams.get("sort");   // ソート順（昇順 or 降順）

        // email が指定されていない場合はエラーを返す
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log("Search Query:", query);  // デバッグ用ログ

        // 検索条件を定義（基本はユーザーのメールアドレスでフィルタ）
        let whereCondition = {
            EmailAdd: email
        };

        // 検索クエリ（query）がある場合、曲名またはアーティスト名で検索
        if (query) {
            whereCondition = {
                ...whereCondition,
                music: {
                    OR: [
                        { MusicName: { contains: query.trim() } },  // 曲名が検索クエリを含む場合
                        { ArtistName: { contains: query.trim() } }  // アーティスト名が検索クエリを含む場合
                    ]
                }
            };
        }

        // Prismaを使ってデータを取得
        const musicid = await prisma.CollectionTable.findMany({
            where: whereCondition, // 検索条件を適用
            include: {
                music: true  // music テーブルのデータも一緒に取得
            },
            orderBy: sort === "desc" ? { Unlocked: "desc" } : { Unlocked: "asc" }, // ソート順を指定
        });

        console.log("Fetched data:", musicid); // デバッグ用ログ

        // 取得データが空の場合は404エラーを返す
        if (!musicid || musicid.length === 0) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }
        
        // 取得したデータをレスポンスとして返す
        return NextResponse.json(musicid);
    
    } catch (e) {
        // エラー発生時の処理（500エラーを返す）
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        // Prismaクライアントを切断
        await prisma.$disconnect();
    }
}