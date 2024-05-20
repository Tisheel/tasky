import { NextFunction, Request, Response } from 'express'
import { getboardMemberRole } from '../db/database.js'

export const boardMember = (req: Request, res: Response, next: NextFunction) => {
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

            next()
        })

    } catch (error) {
        next(error)
    }
}