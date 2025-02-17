import { NextResponse } from 'next/server'

export async function POST(req) {
    const { token } = await req.json();
    console.log(token);
    const devices_res = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const devices = await devices_res.json();
    if (devices.devices.length === 0) {
        console.log("No devices");
        return NextResponse.json({ message: "No devices" });
    }
    const device_id = devices.devices[0].id;
    console.log(device_id);
    const play_res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uris: ["spotify:track:1KLg01cjnRsENoFhJWUTSd"],
        }),
    });
    const res = await play_res.json();
    console.log(res);
    return NextResponse.json({ message: "OK" });
}