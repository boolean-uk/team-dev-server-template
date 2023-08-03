import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import {
  clearComments,
  findPost,
  findPostWithComments,
  editExistingPost,
  createPost,
  deleteExistingPost
} from '../domain/post.js'

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id

  if (!content || content === '' || typeof content !== 'string') {
    return sendErrorResponse(res, 400, 'Must provide valid content')
  }

  const createdPost = await createPost(content, userId)

  return sendDataResponse(res, 201, {
    post: createdPost
  })
}

export const getAll = async (req, res) => {
  return sendDataResponse(res, 200, {
    posts: [
      {
        id: 1,
        content: 'Hello world!',
        author: { ...req.user }
      },
      {
        id: 2,
        content: 'Hello from the void!',
        author: { ...req.user }
      }
    ]
  })
}

export const editPost = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id
  const postId = Number(req.params.id)
  const userRole = req.user.role

  if (
    !content ||
    content.length <= 0 ||
    content === ' ' ||
    typeof content !== 'string'
  ) {
    return sendErrorResponse(res, 400, 'Must provide valid content')
  }

  const userValidation = await findPost(postId)

  if (!userValidation) {
    return sendErrorResponse(res, 404, 'Post not found')
  }

  if (userRole !== 'TEACHER' && userId !== userValidation.user.id) {
    return sendErrorResponse(res, 403, 'Missing Authorization')
  }
  const edited = await editExistingPost(content, postId)
  return sendDataResponse(res, 200, { post: edited })
}

export const deletePost = async (req, res) => {
  const postId = Number(req.params.id)
  const userRole = req.user.role
  const userId = req.user.id

  const findPost = await findPostWithComments(postId)

  if (!findPost) {
    return sendErrorResponse(res, 404, 'Post not found')
  }

  if (userRole !== 'TEACHER' && userId !== findPost.user.id) {
    return sendErrorResponse(
      res,
      403,
      'You are unauthorized to delete this post'
    )
  }

  if (findPost?.comments.length > 0) {
    await clearComments(postId)
  }
  const deletion = await deleteExistingPost(postId)
  return sendDataResponse(res, 200, { post: deletion })
}
