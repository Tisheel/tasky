import { z } from 'zod'
import { userValidation, boardValidation } from './validation.ts'

export type User = z.infer<typeof userValidation>
export type Board = z.infer<typeof boardValidation>

declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}