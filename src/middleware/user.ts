import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { jwt_secret } from '../utils/secrets.js'
import { JWTPayload } from '../utils/types.js'

export const user = (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers.token as string

        if (!token) {
            res.status(400).json({
                error: 'AUTH_ERROR',
                message: 'Token is required.'
            })
            return
        }

        const decoded = jwt.verify(token, jwt_secret) as JWTPayload

        req.userId = decoded.id
        next()

    } catch (error) {
        next(error)
    }
}