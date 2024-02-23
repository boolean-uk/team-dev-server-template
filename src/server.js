import 'dotenv/config'
import fs from 'fs'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import authRouter from './routes/auth.js'
import cohortRouter from './routes/cohort.js'
import deliveryLogRouter from './routes/deliveryLog.js'
import commentRouter from './routes/comment.js'
import teachersRoute from './routes/teachers.js'
import studentsRouter from './routes/student.js'
import notesRouter from './routes/note.js'

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// loading and hosting the docs
const docFile = fs.readFileSync('./docs/openapi.yml', 'utf8')
const swaggerDoc = YAML.parse(docFile)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/cohorts', cohortRouter)
app.use('/logs', deliveryLogRouter)
app.use('/', authRouter)
app.use('/comments', commentRouter)
app.use('/teachers', teachersRoute)
app.use('/students', studentsRouter)
app.use('/notes', notesRouter)

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).json({
    status: 'error',
    data: {
      message: err.message
    }
  })
})

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    data: {
      resource: 'Not found'
    }
  })
})

export default app
