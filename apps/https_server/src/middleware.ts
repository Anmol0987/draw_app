import { JWT_SECRET } from "@repo/backend-config/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            message: "unauthorized"
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        //@ts-ignore
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "unauthorized"
        });
    }
}