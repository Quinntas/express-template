import {Request, Response} from "express";
import compression from "compression";

export const corsOptions = {
    origin: '*',
    credentials: true
}

export const compressionOptions = {
    threshold: '1kb',
    filter: (req: Request, res: Response) => {
        if (res.getHeader('x-no-compression')) return false
        if (res.statusCode === 304) return false
        const type = res.getHeader('Content-Type') as string[]
        if (type && type.indexOf('text/event-stream') > -1) return false
        return compression.filter(req, res)
    }
}