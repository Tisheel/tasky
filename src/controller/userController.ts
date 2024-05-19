import { insertUser, getUserById, getUserByEmail } from "../db/database.js"
import { userValidation } from "../utils/validation.js"
import { NextFunction, Request, Response } from 'express'
import { compare, hash } from 'bcrypt'
import { hashing_salt, jwt_secret } from "../utils/secrets.js"
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await userValidation.parseAsync(req.body)

        const hashedPassword = await hash(user.password, hashing_salt)

        insertUser({ ...user, password: hashedPassword }, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                id: result.insertId
            })
        })

    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const credentials = await userValidation.pick({ email: true, password: true }).parseAsync(req.body)

        getUserByEmail(credentials.email, async (err, rows) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            if (rows.length !== 0) {
                if (await compare(credentials.password, rows[0].password)) {
                    const token = jwt.sign({ id: rows[0].id }, jwt_secret, { expiresIn: '1d' })
                    res.status(200).json({
                        message: 'ok',
                        token
                    })
                } else {
                    res.status(400).json({
                        error: 'INAVLID_CREDENTIALS',
                        message: `wrong password.`
                    })
                }
            } else {
                res.status(404).json({
                    error: 'INVALID_CREDENTIALS',
                    message: `${credentials.email} is not registered.`
                })
            }
        })

    } catch (error) {
        next(error)
    }
}

export const userDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id: number = Number(req.params.id)

        getUserById(id, (err, rows) => {
            if (err) {
                res.status(400).json({
                    error: 'SQL_ERROR',
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: 'ok',
                rows
            })
        })

    } catch (error) {
        next(error)
    }
}