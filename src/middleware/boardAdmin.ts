import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { jwt_secret } from '../utils/secrets.js'
import { getboardMemberRole } from '../db/database.js'
import { JWTPayload } from '../utils/types.js'

export const boardAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers.token as string
        const boardId = Number(req.params.boardId)

        if (!token) {
            res.status(400).json({
                error: 'AUTH_ERROR',
                message: 'Token is required.'
            })
            return
        }

        const decoded = jwt.verify(token, jwt_secret) as JWTPayload

        getboardMemberRole(boardId, decoded.id, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }

            if (result.length === 0) {
                res.status(400).json({
                    error: 'BOARD_MEMBERS_ERROR',
                    message: `Resulting board_id and user_id mapping not found.`
                })
                return
            }

            if (result[0].role === 'admin') {
                req.userId = decoded.id
                next()
            } else {
                res.status(400).json({
                    error: 'USER_ROLE_ERROR',
                    message: 'You do not have admin rights.'
                })
            }
        })

    } catch (error) {
        next(error)
    }
}