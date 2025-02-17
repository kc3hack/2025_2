import { NextResponse } from 'next/server'

async function getTrack(query, token) {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    // console.log(res);
    const resp = await res.json();
    console.log(resp);
    console.log(resp.tracks.items);
    return resp.tracks.items[0].uri;
}

async function getDevice(token) {
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to get devices");
    }
    const devices = await res.json();
    if (devices.devices.length === 0) {//デバイスが見つからない場合
        throw new Error("No devices found");
    }
    return devices.devices[0].id;
}
async function play(token, device_id, uri) {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uris: [`${uri}`],
        }),
    });
    if (!res.ok) {
        const resp = await res.json();
        console.log(resp);
        throw new Error("Failed to play");
    }
    return res.json();
}

export async function POST(req) {
    const { token } = await req.json();
    console.log(token);

    try {
        const track = await getTrack("country", token);
        // const track = "spotify:track:1KLg01cjnRsENoFhJWUTSd";
        const device_id = await getDevice(token);
        console.log(device_id);
        const play_res = await play(token, device_id, track);
        console.log(play_res);
        return NextResponse.json({ message: "OK" });
    } catch (e) {
        console.log("ERROR!!!!!!!!!");
        console.log(e.message);
        switch (e.message) {
            case "Failed to get devices":
                return NextResponse.json({ message: "Failed to get devices" });
            case "No devices found":
                return NextResponse.json({ message: "No devices found" });
        }
        // console.error(e);
        return NextResponse.json({ message: "ERROR" });
    }
}