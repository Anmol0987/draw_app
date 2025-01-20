"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canavas";


export const canvasRoom = ({ canvasId }: {
    canvasId: string
}) => {
    const [socket, setSocket] = useState<WebSocket>();
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzN2QyOGM5Yi0yMWRlLTRiMTQtYjc4NC00N2JjOGI0YmI5MjgiLCJpYXQiOjE3MzczNzQxMjl9.Idi61-XKJWWDi_m3EwkhRlr9Iy_Aqdb6tc3LlbY80Os`);
        ws.onopen = () => {
            // console.log("connected");
            // console.log(ws);
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_canvas",
                canvasId
            });
            // console.log("from ws");
            // console.log(socket);
            ws.send(data)
        }
    },[])

    if(!socket){
        return <div>Loading...</div>
    }
    return <Canvas  canvasId={canvasId} socket={socket} />
}
export default canvasRoom