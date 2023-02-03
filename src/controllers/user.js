import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  // Check for the Required fields
  if (
    !req.body.email ||
    !req.body.password ||
    req.body.email === '' ||
    req.body.password === ''
  ) {
    return sendDataResponse(res, 400, 'missing email or password')
  }

  const userToCreate = await User.fromJson(req.body)
  try {
    // User exists
    const existingUser = await User.findByEmail(userToCreate.email)
    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    // Typeof in the req.body
    const foundNotString = Object.values(req.body).find(
      (field) => typeof field !== 'string'
    )
    if (foundNotString) {
      return sendDataResponse(res, 400, 'one or more fields is invalid')
    }

    // If optinals present: error if not first or last name
    const checkForOptionals = Object.keys(req.body).find(
      (key) => key === 'firstName' || 'lastName' || 'githubUrl' || 'biography'
    )
    if (checkForOptionals && (!req.body.firstName || !req.body.lastName)) {
      console.log('We have optionals BUT not first or last')
      return sendMessageResponse(res, 400, 'Missing first name or last name')
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getAll = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  const { cohort_id: cohortId } = req.body

  if (!cohortId) {
    return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
  }

  return sendDataResponse(res, 201, { user: { cohort_id: cohortId } })
}
