import dbClient from '../utils/dbClient.js'

export const createNoteDb = async (teacherId, studentId, content) => {
  const newNote = await dbClient.note.create({
    data: {
      teacherId: teacherId,
      studentId: studentId,
      content: content
    }
  })
  return newNote
}
