import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body
  console.log('this is the req.user', req.user)
  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  return sendDataResponse(res, 201, {
    post: { id: 1, content: content, author: req.user }
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
