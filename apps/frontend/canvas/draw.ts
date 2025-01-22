import { HTTP_URL } from "@/config"
import axios from "axios"


type Shape = {
    shapeType: "rect" | "square";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    shapeType: "circle";
    x: number;
    y: number;
    radius: number
} | {
    shapeType: "pencil";
    x: number;
    y: number;
} | {
    shapeType: "line";
    x: number;
    y: number;
    width: number;
    height: number;
}


export const draw = async (canvas: HTMLCanvasElement, canvasId: string, socket: WebSocket) => {
    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = await getExistingShapes(canvasId);
    console.log("exisssss", existingShapes);
    if (!ctx) {
        alert("canvas not found");
        return;
    }
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    socket.onmessage = (event) => {
        console.log(event)
        const message = event.data;
        console.log("++++++++++", message)
        if (message.type == "draw") {
            const parsedShape = message;
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes, canvas, ctx);
        }
        clearCanvas(existingShapes, canvas, ctx);
    }

    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        console.log("clicked mousedown")

        //@ts-ignore
        const selectedTool = window.selectedTool;
        console.log(selectedTool)
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            shape = {
                shapeType: "rect",
                x: startX,
                y: startY,
                width,
                height
            }
        }
        else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                shapeType: "circle",
                radius: radius,
                x: startX + radius,
                y: startY + radius,
            }
        }
        else if (selectedTool === "square") {
            const maxw = Math.max(width, height)
            shape = {
                shapeType: "rect",
                x: startX,
                y: startY,
                width: maxw,
                height: maxw
            }
        }
        else if (selectedTool === "line") {
            shape = {
                shapeType: "line",
                x: startX,
                y: startY,
                width:e.clientX,
                height:e.clientY
            }
        }
        if (!shape) {
            return
        }
        existingShapes.push(shape);
        if (shape.shapeType === "rect") {
            socket.send(JSON.stringify({
                type: "draw",
                shapeType: shape.shapeType,
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                canvasId
            }));
        }
        else if (shape.shapeType === "circle") {
            socket.send(JSON.stringify({
                type: "draw",
                shapeType: shape.shapeType,
                x: shape.x,
                y: shape.y,
                radius: shape.radius,
                canvasId
            }));
        }
        else if (shape.shapeType === "square") {
            socket.send(JSON.stringify({
                type: "draw",
                shapeType: shape.shapeType,
                x: shape.x,
                y: shape.y,
                height: shape.height,
                width: shape.width,
                canvasId
            }));
        }
        else if (shape.shapeType === "line") {
            socket.send(JSON.stringify({
                type: "draw",
                shapeType: shape.shapeType,
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                canvasId
            }));
        }
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            // @ts-ignore
            const selectedTool = window.selectedTool;
            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
            else if (selectedTool === "square") {
                const maxW = Math.max(width, height)
                ctx.strokeRect(startX, startY, maxW, maxW);
            }
            else if (selectedTool === "line") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY)
                ctx.stroke();
                ctx.closePath();
            }

        }
    })
}

async function getExistingShapes(canvasId: string) {
    const res = await axios.get(`${HTTP_URL}/canvas/${canvasId}`);
    const shapes = res.data.shapes;
    const shape = shapes.map((x: Shape) => {
        return x;
    })
    return shape;
}
function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.shapeType === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.shapeType === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, Math.abs(shape.radius), 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape.shapeType === "square") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            const maxw = Math.max(shape.width, shape.height)
            ctx.strokeRect(shape.x, shape.y, maxw, maxw);
        }
        else if(shape.shapeType === "line"){
            ctx.beginPath();
            ctx.moveTo(shape.x,shape.y);
            ctx.lineTo(shape.width,shape.height);;
            ctx.stroke()
        }
    })
}
