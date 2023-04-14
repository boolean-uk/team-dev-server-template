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

export async function findByCohortId(id) {
  const foundCohort = await dbClient.cohort.findOne({
    where: {
      id: id
    },
    include: {
      user: true
    }
  })

  if (foundCohort) {
    return Cohort(foundCohort)
  }

  if (!foundCohort) {
    return 'No cohort with {id} found'
  }
}

export async function getStudentsOfCohort(id) {
  const query = {
    where: {
      id: Number(id)
    },
    include: {
      users: true
    }
  }

  const res = await dbClient.cohort.findUnique(query)

  return res
}
