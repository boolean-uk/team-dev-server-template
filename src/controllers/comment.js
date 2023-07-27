import { sendDataResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createComment = async (req, res) => {
  const postId = Number(req.params.postId)
  const { content } = req.body
  const userId = req.user.id

  if (typeof content !== 'string') {
    return sendDataResponse(res, 400, {
      error: 'Comment must be a string'
    })
  }

  if (content.length <= 0 || content.length > 240) {
    if (content.length <= 0) {
      return sendDataResponse(res, 400, { error: 'Comment cannot be empty' })
    } else {
      return sendDataResponse(res, 400, {
        error: 'Comment must be 240 characters or fewer'
      })
    }
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId
      },
      select: {
        id: true,
        content: true
      }
    })
    return sendDataResponse(res, 201, { comment })
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}

export const removeComment = async (req, res) => {
  const commentId = Number(req.body.commentId)
  const user = req.user

  try {
    const commentUser = await prisma.comment.findFirst({
      where: {
        id: commentId
      },
      select: {
        userId: true
      }
    })

    if (!commentUser) {
      return sendDataResponse(res, 404, {
        error: 'No comment with that id was found'
      })
    }

    if (commentUser.userId !== user.id && user.role !== 'TEACHER') {
      return sendDataResponse(res, 401, {
        error: 'Students may only delete their own comments'
      })
    } else {
      const deletedComment = await prisma.comment.delete({
        where: {
          id: commentId
        },
        select: {
          id: true,
          content: true
        }
      })
      return sendDataResponse(res, 200, deletedComment)
    }
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}
