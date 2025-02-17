import { NextResponse } from 'next/server'

async function getTrackTest(query, token) {
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

async function getTrack() {
    return "spotify:track:1KLg01cjnRsENoFhJWUTSd";
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
        throw new Error("Failed to play");
    }
    return res.json();
}

async function pause(token, device_id) {
    const res = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });
    if (!res.ok) {
        throw new Error("Failed to pause");
    }
    return res.json();
}

export async function POST(req) {
    const { token, status } = await req.json();
    console.log(status);

    const device_id = await getDevice(token);

    switch (status) {
        case "play":
            const track = await getTrack();
            const play_res = await play(token, device_id, track);
            break;
        case "pause":
            const pause_res = await pause(token, device_id);
            break;
    }
    return NextResponse.json({ message: "OK" });
}