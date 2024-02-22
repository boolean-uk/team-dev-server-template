import Post from '../domain/post.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  try {
    const post = await Post.create(content, userId)
    return sendDataResponse(res, 201, post)
  } catch (e) {
    console.error('error creating post', e.message)
    return sendDataResponse(res, 500, 'something went wrong')
  }
}

export const getAll = async (req, res) => {
  const posts = await Post.getAll()
  return sendDataResponse(res, 200, { posts })
}

export const deletePost = async (req, res) => {
  const postId = req.post.id

  const deletedPost = await Post.deleteById(postId)

  return sendDataResponse(res, 200, deletedPost)
}

export const editPost = async (req, res) => {
  const postId = Number(req.params.postId)
  const { content } = req.body
  const userId = req.user.id

  if (!postId) {
    console.error('postId is required')
    return sendDataResponse(res, 400, { error: 'postId is required' })
  }

  try {
    const result = await Post.updateByIdAndUserId(postId, userId, content)
    if (result.error) {
      console.error('Error updating post:', result.error) // Log the error here as well
      return sendDataResponse(res, result.status, { error: result.error })
    }

    return sendDataResponse(res, 200, {
      message: 'Post updated successfully',
      post: result.post
    })
  } catch (error) {
    console.error('Exception error updating post:', error.message) // This captures exceptions thrown during the process
    return sendDataResponse(res, 500, { error: 'Something went wrong' })
  }
}

export const likePost = async (req, res) => {
  const { postId } = req.params
  const userId = req.user.id

  try {
    const message = await Post.toggleLike(Number(postId), userId)
    res.status(200).json({ message })
  } catch (error) {
    console.error('Error handling like action:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
