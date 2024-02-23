import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const department1 = await createDepartment('Software Development')
  const department2 = await createDepartment('Data Analytics')
  const cohort1 = await createCohort('Cohort 1', department1)
  const cohort2 = await createCohort('Cohort 2', department2)
  await createCohort('Cohort 3', department1)

  const student1 = await createUserWithRole(
    'student@test.com',
    'Testpassword1!',
    'STUDENT',
    cohort1.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'https://github.com/student1',
    'Software Developer'
  )
  await createUserWithRole(
    'student2@test.com',
    'Testpassword1!',
    'STUDENT',
    cohort2.id,
    'Lee',
    'Dev',
    'Hello, world!',
    'https://github.com/student1',
    'Data Analyst'
  )
  // Creating teacher users with specific departments
  const teacher1 = await createUserWithRole(
    'teacher@test.com',
    'Testpassword1!',
    'TEACHER',
    null,
    'Rick',
    'Sanchez',
    'Wubba Lubba Dub Dub!',
    'https://github.com/rick',
    null,
    department1
  )
  await createUserWithRole(
    'teacher2@test.com',
    'Testpassword1!',
    'TEACHER',
    null,
    'Max',
    'Smith',
    'Hello there',
    'https://github.com/max',
    null,
    department2
  )
  await createPost(
    student1.id,
    'My first post!',
    [
      { content: 'hi', userId: 2 },
      { content: "'sup?", userId: 2 }
    ],
    [{ userId: 2 }]
  )
  await createPost(teacher1.id, 'Hello, students', [], [{ userId: 1 }])

  await createNote(
    student1.id,
    teacher1.id,
    'note on student 1',
    'they be learnin'
  )

  process.exit(0)
}

async function createPost(userId, content, comments, likes) {
  const post = await prisma.post.create({
    data: {
      userId,
      content,
      comments: {
        create: comments
      },
      likes: {
        create: likes
      }
    },
    include: {
      user: true,
      comments: true,
      likes: true
    }
  })

  console.info('Post created', post)

  return post
}

async function createNote(studentUserId, teacherUserId, title, content) {
  return await prisma.note.create({
    data: {
      title,
      content,
      student: { connect: { userId: studentUserId } },
      teacher: { connect: { userId: teacherUserId } }
    }
  })
}

async function createDepartment(name) {
  const department = await prisma.department.create({
    data: {
      name
    }
  })
  console.info('Department created', department)
  return department
}

async function createCohort(name, department) {
  const cohort = await prisma.cohort.create({
    data: {
      name,
      department: {
        connect: {
          id: department.id
        }
      }
    },
    include: {
      students: true,
      department: true
    }
  })

  console.info('Cohort created', cohort)

  return cohort
}

async function createUserWithRole(
  email,
  password,
  role,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUrl,
  title,
  department
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const userData = {
    email,
    password: hashedPassword,
    role,
    profile: {
      create: {
        firstName,
        lastName,
        bio,
        githubUrl
      }
    }
  }

  const user = await prisma.user.create({
    data: userData,
    include: {
      profile: true
    }
  })

  if (role === 'TEACHER' && department) {
    await prisma.teacher.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        department: {
          connect: {
            id: department.id
          }
        }
      },
      include: {
        department: {
          select: {
            name: true
          }
        }
      }
    })
  }

  if (role === 'STUDENT') {
    await prisma.student.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        cohort: {
          connect: {
            id: cohortId
          }
        },
        title
      },
      include: {
        cohort: {
          select: {
            name: true
          }
        }
      }
    })
  }

  console.info(`${role} created:`, user.email)
  return user
}

seed().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
