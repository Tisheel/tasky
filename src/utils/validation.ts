import { z } from 'zod'

export const userValidation = z.object({
    name: z.string().min(3, 'Name should have atleast 3 characters.').max(25, 'Name can have maximum of 25 characters.'),
    email: z.string().email('Not a valid email.').min(1, 'Email field is reqiured.'),
    password: z.string().min(7, 'Password should have atleast 7 characters.').max(25, 'Password can have maximum of 25 characters.'),
    profile: z.string()
})

export const boardValidation = z.object({
    title: z.string().min(3, 'Title should have atleast 3 characters.').max(25, 'Title can have maximum of 25 characters.')
})