

// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { token, query } = await req.json();

//   // ここでSpotify APIを叩いて曲を検索する

//   try {
//     const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
//     }
//     const data = await res.json();
//     console.log(data);
//     return NextResponse.json({ tracks: data.tracks.items });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
//   }



//   return NextResponse.json({ tracks: [] });
// }

import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    console.log("🔄 Fetching Spotify access token...");

    // Spotify のアクセストークンを取得
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenResponse.json();
    console.log("🔑 Token Response:", tokenData);

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: tokenData }, { status: tokenResponse.status });
    }

    const accessToken = tokenData.access_token;
    console.log("✅ Got Access Token:", accessToken);

    // Spotify の曲を検索
    console.log(`🔎 Searching tracks for: ${query}`);
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    console.log("🎵 Spotify API Response:", data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ tracks: data.tracks.items });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}