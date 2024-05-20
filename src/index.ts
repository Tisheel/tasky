import express, { Express } from 'express'
import userRouter from './routes/userRouter.js'
import boardRouter from './routes/boardRouter.js'
import taskRouter from './routes/taskRouter.js'
import errorHandler from './middleware/errorHandler.js'
import { port } from './utils/secrets.js'

const app: Express = express()

    ; (() => {

        //middlewares
        app.use(express.json())

        //routes
        app.use('/user', userRouter)
        app.use('/board', boardRouter)
        app.use('/task', taskRouter)

        //error handler
        app.use(errorHandler)

        app.listen(port, () => {
            console.log(`Server on port:${port}`)
        })

    })()