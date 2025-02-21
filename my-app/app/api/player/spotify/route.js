import { NextResponse } from 'next/server'

//複数台起動時の処理を追加してもいいかも
async function getDevice(token) {
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        console.log(res.statusText);
        throw new Error("Failed to get devices");
    }
    const devices = await res.json();
    const smartPhone = devices.devices.filter((device) => {
        return (device.type == "Smartphone")
    })
    if (smartPhone.length == 0) {
        throw new Error("Device is not booting")
    }
    return smartPhone[0].id;
}

async function getPlayer(token) {
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(res.statusText);
    const player = await res.json();
    console.log(player.progress_ms)
    return player;
}

async function controlPlay(device, token) {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
    });
    if (!res.ok) {
        console.log(res)
        throw new Error("Failed to play")
    }
}
async function controlPause(device, token) {
    const res = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        console.log(res)
        throw new Error("Failed to pause")
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    try {
        const player = await getPlayer(token);
        return NextResponse.json(player);
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: "error" });
    }

}

export async function PUT(req) {
    const { action, token, musicID } = await req.json();

    try {
        const device = await getDevice(token);
        console.log(`GET Device : ${device}`)
        switch (action) {
            case "play":
                controlPlay(device, token);
                break;
            case "pause":
                controlPause(device, token);
                break;
            case "next":
                break;
            default:
                throw new Error("action is not found")
        }
        return NextResponse.json({ message: "OK" });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "error" });
    }


    switch (action) {
        case "play":
            break;
        case "stop":
            break;
        case "next":
            break;
    }
    return NextResponse.json({ message: "OK" });
}