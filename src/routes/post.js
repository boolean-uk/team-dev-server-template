import { Router } from 'express'
import { create, getAll, deleteById, updateById } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { createLike } from '../controllers/like.js'
const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.delete('/:id', validateAuthentication, deleteById)
router.patch('/:id', validateAuthentication, updateById)
router.post('/:id/likes', validateAuthentication, createLike)

export default router
