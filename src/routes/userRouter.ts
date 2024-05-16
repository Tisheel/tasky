import { Router } from 'express'
import { login, register, userDetails } from '../controller/userController.js'

const router:Router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/:id', userDetails)

export default router