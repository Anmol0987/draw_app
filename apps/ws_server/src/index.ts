import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/config";
import { prismaClient } from "@repo/db/prisma";

const wss = new WebSocketServer({ port: 8080 });
interface User {
    ws: WebSocket,
    canvas: string[],
    userId: string
}

const users: User[] = [];

const checkUser = (token: string) => {
    console.log(token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded == "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }
        console.log(decoded);
        return decoded.userId;
    } catch (e) {
        return null;
    }
    return null;
}



wss.on("connection", (ws, req) => {
    const url = req.url
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);
    if (userId == null) {
        ws.close();
        return;
    }
    users.push({
        userId,
        canvas: [],
        ws
    })

    ws.on("message", async (data) => {
        let parsedData;
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
        }
        else {
            parsedData = JSON.parse(data);
        }

        if (parsedData.type == "join_canvas") {
            console.log("here");
            const user = users.find(u => u.ws == ws);
            user?.canvas.push(parsedData.canvasId);
        }
        if (parsedData.type == "leave_canvas") {
            const user = users.find(u => u.ws == ws);
            if (!user) {
                return;
            }
            user.canvas = user?.canvas.filter(x => x === parsedData.canva);
        }
        console.log(parsedData);
        console.log(userId);
        if (parsedData.type == "draw") {
            const canvasId = parsedData.canvasId;
            const shapeType = parsedData.shapeType;
            const x = parsedData.x;
            const y = parsedData.y;
            const radius = parsedData.radius || null;
            const height = parsedData.height || null;
            const width = parsedData.width || null;
            await prismaClient.shape.create({
                data: {
                    canvasId: Number(canvasId),
                    shapeType,
                    x: Number(x),
                    y: Number(y),
                    radius:Number(radius),
                    height: Number(height),
                    width: Number(width),
                    userId
                }
            })
            users.forEach(user => {
                if (user.canvas.includes(canvasId)) {
                    user.ws.send(JSON.stringify({
                        type: "draw",
                        shapeType,
                        canvasId,
                        x,
                        y,
                        radius,
                        height,
                        width,
                    }))
                }
            })
        }
    })
})