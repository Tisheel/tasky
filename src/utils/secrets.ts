import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' })
} else {
    console.log('.env file is required.')
    process.exit(1)
}

export const ENV = process.env.NODE_ENV

const isProd = ENV === 'production'

export const port = process.env.PORT as string
export const mysql_password = process.env.MYSQL_PASSWORD as string
export const hashing_salt = Number(process.env.HASHING_SALT)
export const jwt_secret = process.env.JWT_SECRET as string