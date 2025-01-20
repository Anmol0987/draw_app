"use client"
import {draw}  from "../canvas/draw";
import { useEffect, useRef } from "react";

export const Canvas = ({ canvasId, socket }: {
    canvasId: string,
    socket: WebSocket
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            draw(canvasRef.current, canvasId, socket);
        }
    }, [canvasRef]);
    return <div>
        <canvas ref={canvasRef} width={1000} height={900}></canvas>
    </div>
}