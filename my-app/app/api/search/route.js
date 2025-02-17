// import { NextResponse } from "next/server";

// console.log("API /api/search was called!");

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("query");

//   if (!query) {
//     return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
//   }

//   return NextResponse.json({ tracks: [] }); // ダミーデータ
// }

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token, query } = await req.json();

  // ここでSpotify APIを叩いて曲を検索する

  try {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
    }
    const data = await res.json();
    console.log(data);
    return NextResponse.json({ tracks: data.tracks.items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }



  return NextResponse.json({ tracks: [] });
}

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("query");

//   if (!query) {
//     return NextResponse.json({ error: "Query is required" }, { status: 400 });
//   }


//   try {
//     const response = await axios.get(`https://api.spotify.com/v1/search`, {
//       params: {
//         q: query,
//         type: "track",
//         limit: 10
//       },
//       headers: {
//         Authorization: `Bearer BQDq5ewOjfHmVv2WTTQWI3S6euu5e_2lXvL-vl5m29ywACGkVUu_4Ouiho5y2ZNKoQqD5yPSslACVtgF0NiOKPhgSjoCXQwY2IjESottVWaFY1Oui5Ol_X_gQLvySGFuE0uu6KTBNZYUTpzXkN4sEUWZ493JMZynPgmNxK4AQl4wD1IhKqkCOgOwASKXTcrpE4WySVGAy1so1gniBhAJLsGxfunsHGibwl9Z_CCI7KL_8_A6v4z1DD3tJYMxRRyuvm5fGsBSKiX4M2k0D5b16hsXjK0TiKBp_GCEqpVeebVQeODp`
//       }
//     });

//     return NextResponse.json({ tracks: response.data.tracks.items });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
//   }
// }