import Comment from '../domain/commentss.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const commentToCreate = await Comment.fromJson(req.body)
    commentToCreate.userId = req.user.id
    const createdComment = await commentToCreate.save()

    if (!createdComment) {
      return sendDataResponse(res, 400, {
        error: 'User details not provided for creating a comment'
      })
    }

    return sendDataResponse(res, 201, {
      comment: { ...createdComment }
    })
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new comment')
  }
}
