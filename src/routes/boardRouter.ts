import { Router } from 'express'
import { createBoard } from '../controller/boardController.js'
import { user } from '../middleware/user.js'

const router: Router = Router()

router.post('/create', user, createBoard)

export default router