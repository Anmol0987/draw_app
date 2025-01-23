"use client"
import { draw } from "../canvas/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Minus, Mouse, Pencil, Pointer, RectangleHorizontalIcon, SquareIcon } from "lucide-react";
import { IconTool } from "./IconTool";

export type Tool = "mouse" | "circle" | "rect" | "pencil" | "square" | "line";

export const Canvas = ({ canvasId, socket }: {
    canvasId: string,
    socket: WebSocket
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")


    useEffect(() => {
        //@ts-ignore
        window.selectedTool = selectedTool
        //@ts-ignore
        const tools = window.selectedTool
        console.log("+++++", tools)
    }, [selectedTool]);
    useEffect(() => {
        if (canvasRef.current) {
            draw(canvasRef.current, canvasId, socket);
        }
    }, [canvasRef, canvasId, socket]);


    return <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <TopBar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>

}
const TopBar = ({ setSelectedTool, selectedTool }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) => {
    console.log(selectedTool);
    return (
        <div style={{
            position: "fixed",
            top: 10,
            left: 10,
            backgroundColor: "gray",
            padding: 10
        }}>
            <div className="flex gap-2">

                <IconTool onClick={() => {
                    setSelectedTool("mouse")
                }} activated={selectedTool === "mouse"} icon={<Mouse />} />
                <IconTool
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil  />}
                />
                <IconTool onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} />
                <IconTool onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />} />
                <IconTool onClick={() => {
                    setSelectedTool("square")
                }} activated={selectedTool === "square"} icon={<SquareIcon />} />
                <IconTool onClick={() => {
                    setSelectedTool("line")
                }} activated={selectedTool === "line"} icon={<Minus />} />
            </div>
        </div>
    )
}