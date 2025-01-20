import express from "express";
import { JWT_SECRET } from "@repo/backend-config/config";
import { canvasSchema, SigninSchema, signupSchema } from "@repo/common/zod";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/prisma";
import { authMiddleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const parsedData = signupSchema.safeParse(req.body);
    console.log(parsedData);
    if (!parsedData.success) {
        res.status(400).json({
            message: "invalid input"
        });
        return;
    }
    const { email, password, name } = parsedData.data;
    // db logic
    try {

        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password
            }
        })
        const userId = user.Id;
        res.json({
            userId
        });
    }
    catch (error) {
        res.status(400).json({
            message: "invalid input"
        });
    }
});
app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "invalid input"
        });
        return;
    }
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data.email,
                password: parsedData.data.password
            }
        })
        if (!user) {
            res.status(400).json({
                message: "invalid input"
            });
            return;
        }
        const token = jwt.sign({
            userId: user.Id
        }, JWT_SECRET);

        res.json({
            token
        })

    }
    catch (error) {
        res.status(400).json({
            message: "invalid password or input"
        });
    }
});
app.post("/canvas", authMiddleware, async(req, res) => {

    const parsedData = canvasSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "invalid canvas Id"
        });
        return;
    }
    //@ts-ignore
    const slug  = parsedData.data.Id;
    console.log(slug);
    const canvas =await prismaClient.canvas.create({
        data: {
            slug,
            //@ts-ignore
            adminId: req.user.userId
        }
    })
    res.json({
       canvas
    })

});


app.get("/canvas/:canvasId", (req, res) => {
const canvasId = req.params.canvasId;
try{
    const canvas = prismaClient.canvas.findUnique({
        where: {
            Id: Number(canvasId)
        }
    
    })
    res.json({
        canvas
    })
}
catch (error) {
    res.status(400).json({
        message: "invalid canvas Id"
    });
}
});

app.listen(3001);
