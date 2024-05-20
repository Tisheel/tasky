import { Request, Response, NextFunction } from 'express'
import { taskValidation } from '../utils/validation.js'
import { deleteTaskById, getTasksByBoardId, insertTask } from '../db/database.js'

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const boardId = Number(req.params.boardId)

        const task = await taskValidation.parseAsync(req.body)

        insertTask(boardId, task, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                insertId: result.insertId
            })
        })

    } catch (error) {
        next(error)
    }
}

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const boardId = Number(req.params.boardId)

        getTasksByBoardId(boardId, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
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

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const taskId = Number(req.params.taskId)

        deleteTaskById(taskId, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                affectedRows: result.affectedRows
            })
        })

    } catch (error) {
        next(error)
    }
}