import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import {
  createCourse,
  findByCohortId,
  findByCourseName
} from '../domain/courses.js'

const validateCourseFunctionInputs = (req) => {
  const { name, cohortId } = req.body
  const keys = Object.keys(req.body)

  const invalidKeys = keys.find((key) => {
    return key !== 'name' && key !== 'cohortId'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('name') && typeof req.body.name !== 'string') {
    return { Error: 'Course name must be a string!' }
  }
  if (keys.includes('cohortId') && typeof req.body.cohortId !== 'number') {
    return { Error: 'Cohort id must be a number!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!name) {
    return { Error: 'Please provide Course name immediatley!' }
  }
  if (!cohortId) {
    return { Error: 'Please provide Cohort Id immediatley!' }
  }
  return null
}
export const addCourse = async (req, res) => {
  const { name, cohortId } = req.body

  const validationError = validateCourseFunctionInputs(req)
  if (validationError) {
    return sendErrorResponse(res, 400, validationError)
  }
  const existingCourse = await findByCourseName(name)
  const existingCohort = await findByCohortId(cohortId)

  if (existingCourse) {
    return sendErrorResponse(res, 409, 'Course already exists!')
  }
  if (!existingCohort) {
    return sendErrorResponse(res, 404, 'Cohort does not exist!')
  }
  try {
    const newCourse = await createCourse(name, cohortId)
    return sendDataResponse(res, 201, { course: newCourse })
  } catch (err) {
    console.error(err)
    return sendErrorResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}
