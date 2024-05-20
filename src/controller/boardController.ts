import { NextFunction, Request, Response } from 'express'
import { boardValidation } from '../utils/validation.js'
import { deleteBoard, deleteBoardMember, getBoardMembers, getboardMemberRole, insertBoard, insertBoardMembers } from '../db/database.js'

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const board = await boardValidation.parseAsync(req.body)

        insertBoard(board, req.userId, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                insertId: result?.insertId
            })
        })

    } catch (error) {
        next(error)
    }
}

export const joinBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const boardId = Number(req.params.boardId)

        insertBoardMembers(boardId, req.userId, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                affectedRows: result?.affectedRows
            })
        })

    } catch (error) {
        next(error)
    }
}

export const leaveBoard = async (req: Request, res: Response, next: NextFunction) => {
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
                    message: `Resulting board_id not found.`
                })
                return
            }

            if (result[0].role === 'admin') {
                deleteBoard(boardId, (err, result) => {
                    if (err) {
                        res.status(400).json({
                            error: 'SQL_ERROR',
                            message: err.message
                        })
                        return
                    }
                    res.status(200).json({
                        message: 'ok',
                        affectedRows: result?.affectedRows
                    })
                })
            } else {
                deleteBoardMember(boardId, req.userId, (err, result) => {
                    if (err) {
                        res.status(400).json({
                            error: 'SQL_ERROR',
                            message: err.message
                        })
                        return
                    }
                    res.status(200).json({
                        message: 'ok',
                        affectedRows: result?.affectedRows
                    })
                })
            }
        })

    } catch (error) {
        next(error)
    }
}

export const removeBoardMember = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const boardId = Number(req.params.boardId)
        const userId = Number(req.params.userId)

        if (userId === req.userId) {
            res.status(400).json({
                error: 'BOARD_ADMIN_ERROR',
                message: 'You cannot kick your self.'
            })
            return
        }

        deleteBoardMember(boardId, userId, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                affectedRows: result?.affectedRows
            })
        })

    } catch (error) {
        next(error)
    }
}

export const boardMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const boardId = Number(req.params.boardId)

        getBoardMembers(boardId, (err, result) => {
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
                    message: `Resulting board_id not found.`
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                result
            })
        })

    } catch (error) {
        next(error)
    }
}
