import { NextFunction, Request, Response } from 'express'
import { getboardMemberRole } from '../db/database.js'

export const boardAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {

        const boardId = Number(req.params.boardId)

        getboardMemberRole(boardId, req.userId, (err, result) => {
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
                    message: `User does not belong to the board.`
                })
                return
            }

            if (result[0].role === 'admin') {
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