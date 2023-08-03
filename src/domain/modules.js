import dbClient from '../utils/dbClient.js'

async function _findModule(key, value) {
  const foundModule = await dbClient.module.findUnique({
    where: {
      [key]: value
    },
    include: {
      units: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (foundModule) {
    return foundModule
  }
  return null
}

export async function findByModuleName(name) {
  return await _findModule('name', name)
}
export async function createModule(name, courseId) {
  return await dbClient.module.create({
    data: {
      name,
      courses: {
        connect: {
          id: courseId
        }
      }
    },
    include: {
      courses: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

export async function updateModuleDetails(moduleId, name, courseId) {
  return await dbClient.module.update({
    where: {
      id: moduleId
    },
    data: {
      name,
      courses: {
        connect: { id: courseId }
      }
    }
  })
}

export async function getModuleById(moduleId) {
  return await _findModule('id', moduleId)
}
