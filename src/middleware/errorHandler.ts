import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { ZodError } from "zod"

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof ZodError) {
        res.status(400).json({
            error: 'VALIDATION_ERROR',
            issues: error.issues
        })
        return
    }

    if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({
            error: 'JWT_ERROR',
            message: error.message
        })
        return
    }

    res.status(500).json({
        message: 'Somthing went wrong.'
    })

}

export default errorHandler