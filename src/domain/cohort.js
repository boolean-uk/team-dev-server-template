import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort() {
  const createdCohort = await dbClient.cohort.create({
    data: {}
  })

  return new Cohort(createdCohort.id)
}

export class Cohort {
  constructor(id = null) {
    this.id = id
  }

  toJSON() {
    return {
      cohort: {
        id: this.id
      }
    }
  }
}

export async function getCohort(cohortId) {
  return await dbClient.cohort.findUnique({
    where: {
      id: cohortId
    }
  })
}

export async function getAllCohorts() {
  return await dbClient.cohort.findMany({
    include: {
      users: {
        select: {
          email: true,
          role: true,
          profile: true
        }
      }
    }
  })
}
