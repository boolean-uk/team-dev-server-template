import dbClient from '../utils/dbClient.js'

async function _findByUnique(name) {
  const foundCourse = await dbClient.course.findUnique({
    where: {
      name
    }
  })

  if (foundCourse) {
    return foundCourse
  }
  return null
}
export async function findByCourseName(name) {
  return await _findByUnique(name)
}

export async function createCourse(name) {
  return await dbClient.course.create({
    data: {
      name
    }
  })
}
