import { z } from 'zod'
import { userValidation, boardValidation, taskValidation } from './validation.ts'

export type User = z.infer<typeof userValidation>
export type Board = z.infer<typeof boardValidation>
export type Task = z.infer<typeof taskValidation>

export interface JWTPayload {
    id: number
}

declare global {
    namespace Express {
        interface Request {
            userId: number
        }
    }
}