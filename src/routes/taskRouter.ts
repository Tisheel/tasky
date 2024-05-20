import { Router } from 'express'
import { createTask, getTasks, removeTask } from '../controller/taskController.js'
import { user } from '../middleware/user.js'
import { boardMember } from '../middleware/boardMember.js'

const router: Router = Router()

router.post('/create/:boardId', user, boardMember, createTask)
router.get('/:boardId', user, boardMember, getTasks)
router.delete('/delete/:boardId/:taskId', user, boardMember, removeTask)

export default router