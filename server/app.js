import express from 'express'
import bodyParser from 'body-parser'

import roleRoutes from './routes/roleRoutes'
import userRoutes from './routes/userRoutes'
import todoRoutes from './routes/todoRoutes'

// Set up the express app
const app = express()
const port = process.env.PORT || 3000


// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1/roles', roleRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/todos', todoRoutes)

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to TODO API',
}))

app.listen(port, () => {
  console.log(`App is running on ${port}`)
})

export default app
