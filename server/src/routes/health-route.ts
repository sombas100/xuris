import type { RequestHandler } from "express";


const healthCheck: RequestHandler = (req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timeStamp: new Date().toISOString()
    })
}

export default healthCheck;