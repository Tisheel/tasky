import { NextFunction, Request, Response } from 'express'
import { boardValidation } from '../utils/validation.js'
import { insertBoard } from '../db/database.js'

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const board = await boardValidation.parseAsync(req.body)

        insertBoard(board, req.userId, (err, result) => {
            if (err) {
                console.log(err)
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