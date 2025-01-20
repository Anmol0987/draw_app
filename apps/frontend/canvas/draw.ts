import { HTTP_URL } from "@/config"
import axios from "axios"


type Shape = {
    shapeType: "rect";
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
            console.log("-------------", parsedShape);
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes, canvas, ctx);
        }
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
        const shape: Shape = {
            shapeType: "rect",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        }
        existingShapes.push(shape);
        socket.send(JSON.stringify({
            type: "draw",
            shapeType: shape.shapeType,
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            canvasId
        }));
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0, 0, 0)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}

async function getExistingShapes(canvasId: string) {
    const res = await axios.get(`${HTTP_URL}/canvas/${canvasId}`);
    const messages = res.data.shapes;
    const shapes = messages.map((x: Shape) => {
        return x;
    })
    return shapes;
}
function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Iterate through existingShapes safely
    existingShapes.forEach((shape) => {
        // Check if the shape is defined and has a shapeType
        if (shape && typeof shape.shapeType === "string") {
            if (shape.shapeType === "rect") {
                ctx.strokeStyle = "rgba(255, 255, 255)";
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
        } else {
            console.warn("Invalid shape:", shape);
        }
    });
}
