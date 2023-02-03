import Post from '../domain/posts.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const postToCreate = await Post.fromJson(req.body)
    postToCreate.userId = req.user.id
    const createdPost = await postToCreate.save()

    if (!createdPost) {
      return sendDataResponse(res, 400, {
        error: 'User details not provided for creating a post'
      })
    }

    return sendDataResponse(res, 201, {
      post: { ...createdPost }
    })
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new post')
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await Post.findAll()
    // posts = posts.map((obj) => {
    //   obj.author = obj.user
    //   console.log(obj)
    //   // delete obj.user
    //   return obj
    // })
    console.log('fetched posts', posts)
    return sendDataResponse(res, 200, { posts })
  } catch (error) {
    console.error('finding all posts', error)
    return sendMessageResponse(res, 401, 'Unable to get posts')
  }
}
