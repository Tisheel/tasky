import { Router } from 'express'
import { boardMembers, createBoard, joinBoard, leaveBoard, removeBoardMember } from '../controller/boardController.js'
import { user } from '../middleware/user.js'
import { boardAdmin } from '../middleware/boardAdmin.js'
import { boardMember } from '../middleware/boardMember.js'

const router: Router = Router()

router.post('/create', user, createBoard)
router.post('/join/:boardId', user, joinBoard)
router.delete('/leave/:boardId', user, leaveBoard)
router.delete('/remove-member/:boardId/:userId', user, boardAdmin, removeBoardMember)
router.get('/members/:boardId', user, boardMember, boardMembers)

export default router