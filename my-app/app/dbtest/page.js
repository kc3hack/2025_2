"use client"

import { useState } from "react"

export default function Home() {
    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");

    const [users, setUsers] = useState("");


    return (
        <>
            <h1>DB Test</h1>
            <label>
                Name:
                <input type="text" value={Name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label>
                Email:
                <input type="text" value={Email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <br />
            <button onClick={async () => {
                console.log(Name, Email);
                const res = await fetch("/api/testdb", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ Name, Email })
                })
                const json = await res.json();
                console.log(json);
            }}>Submit</button>
            <br />
            <button onClick={async () => {
                const res = await fetch("/api/testdb")
                const json = await res.json();
                console.log(json);
                setUsers(JSON.stringify(json, null, "\t"));
            }}>Get Users</button>
            <br />
            <div>
                {users}
            </div>
        </>
    )
}