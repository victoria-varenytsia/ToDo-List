const express = require('express')
const { createConnection } = require('typeorm')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const Task = require('./entity/Task')
const User = require('./entity/User')
const app = express()
const port = 3000

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const { connection } = require('mongoose')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

createConnection()
	.then(connection => {
		console.log('Connected to MongoDB with TypeORM')
	})
	.catch(err => console.log('Error connecting', err))

let todos = []

app.use(express.static('public'))
app.use(express.json())

app.get('/todos', (req, res) => {
	res.json(todos)
})

app.post('/register', (req, res) => {
	const userRepository = connection.getRepository(User)
	const newUser = new User()
	newUser.username = req.body.username
	newUser.email = req.body.email
	newUser.password = req.body.password

	userRepository()
		.save(newUser)
		.then(() => {
			res.status(200).json({ success: true, newUser })
		})
		.catch(err => {
			res
				.status(400)
				.json({ success: false, message: 'Username already exists' })
		})
})

app.post('/login', async (req, res) => {
	const userRepository = connection.getRepository(User)
	const registeredUser = await userRepository.findOne({
		username: req.body.username,
	})

	if (!registeredUser) {
		return res.status(400).json({ success: false, message: 'Unknown user' })
	}
	if (registeredUser.password === req.body.password) {
		const token = jwt.sign(
			{ userId: registeredUser.id },
			proces.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)
		res.status(200).json({
			success: true,
			message: 'Logged in successfully',
			token: token,
		})
	} else {
		res.status(400).json({ success: false, message: 'Wrong password' })
	}
})

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['autorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: 'No token provided' })
	}

	jwt.verify(token, proces.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res
				.status(403)
				.json({ success: false, message: 'Token is not valid' })
		}
		req.user = user
		next()
	})
}

app.post('/add', authenticateToken, (req, res) => {
	const TaskRepository = connection.getRepository(Task)
	const task = req.body.task
	if (task) {
		const newTask = new Task({ todo: task })

		TaskRepository()
			.save(newTask)
			.then(() => res.status(200).json({ success: true, newTask }))
			.catch(err =>
				res.status(400).json({ success: false, message: 'Error saving task' })
			)
	} else {
		res.status(400).json({ success: false, message: 'task not found' })
	}
})

app.delete('/delete/:id', async (req, res) => {
	const id = req.params.id

	try {
		const TaskRepository = await connection.getTaskRepository(Task)
		const deletedTask = TaskRepository.delete(id)

		if (!deletedTask.affected) {
			res.status(400).json({ success: false, message: 'error deleting task' })
		}
		res
			.status(200)
			.json({ success: true, message: 'task successfully deleted' })
	} catch (error) {
		res.status(500).json({ success: false, message: 'Error deleting task' })
	}
})

app.put('/edit/:id',async (req, res) => {
	const id = req.params.id
	const updatedTask = req.body.task

	try{
const TaskRepository = await connection.getRepository(Task)
const task = TaskRepository.findById(id)

  if (!task) {
		res.status(404).json({ success: false, message: 'Task not found' })
	}

	task.todo = updatedTask
	res.status(200).json({ success: true, message:'task updated' })
	}
	catch{
res.status(500).json({ success: false, message: 'Server error' })
	}
})

app.post('/email',async (req, res) => {
	const email = req.body.email
	const username = req.body.username

	try{
		  const userRepository = connection.getRepository(User)
      const user = await userRepository.findOne({ email: email })
  if (!user) {
				return res
					.status(404)
					.json({ success: false, message: 'User not found' })
			}

			const tasks = user.tasks.map(task => task.todo).join('\n')

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'viktoriia.varenytsia.pz.2022@lpnu.ua',
					pass: '*******',
				},
			})

			const mailOptions = {
				from: 'viktoriia.varenytsia.pz.2022@lpnu.ua',
				to: email,
				subject: `Tasks for ${username}`,
				text: 'Here are your tasks:\n' + tasks,
			}

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error('Error sending email:', error)
					return res
						.status(400)
						.json({ success: false, message: 'Error sending email' })
				}
				res
					.status(200)
					.json({ success: true, message: 'Email sent successfully' })
			})
		}

		catch(error) {
			res.status(500).json({ success: false, message: 'Error finding user' })
		}
})

app.listen(port, () => {
	console.log(`server listening on port ${port}`)
})
