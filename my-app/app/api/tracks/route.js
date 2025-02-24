import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

function calc(Latitude, Longitude) {
  return Math.floor((Latitude + 90) / 0.01) * 2700 + Math.floor((Longitude + 180) / 0.01);
}

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(" Received Data:", body); // 受け取ったデータをログ出力

    const { MusicID, MusicName, ArtistName, ImageUrl, Duration, Latitude, Longitude } = body;

    // 必須パラメータのチェック
    if (!MusicID || !MusicName || !ArtistName || Latitude == null || Longitude == null) {
      console.error("Missing required fields:", { MusicID, MusicName, ArtistName, ImageUrl, Duration });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Adding track:", { MusicID, MusicName, ArtistName });

    // すでに登録済みか確認
    const existingTrack = await prisma.MusicTable.findFirst({
      where: {
        MusicID: MusicID,
      },
    });

    const track = { MusicID, MusicName, ArtistName, ImageUrl, Duration }

    if (!existingTrack) {
      // 新規追加
      await prisma.MusicTable.create({
        data: track,
      });
    }

    // BlockNo を計算
    const BlockNo = calc(Latitude, Longitude);

    // EntryTable にもデータ追加
    const entry = await prisma.entryTable.create({
      data: {
        MusicID: MusicID,
        Latitude,
        Longitude,
        BlockNo,
      },
    });

    console.log("Track added successfully:", track);
    return NextResponse.json({ message: "Track added successfully", track }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save track", details: error.message }, { status: 500 });//エラー
  }
}