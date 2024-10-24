const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000

mongoose.connect('mongodb+srv://victoria:122333@todo-list.dvgbi.mongodb.net/',{
	useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
	console.log('Connected to MongoDB')
}).catch(err => console.log('Error connecting',err)
)

const TaskSchema = new mongoose.Schema({
todo:String
})


const UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	tasks:[TaskSchema],
})

const User = mongoose.model('User',UserSchema)
const Task = mongoose.model('Task',TaskSchema)

let todos = []

app.use(express.static('public'))
app.use(express.json())

app.get('/todos', (req, res) => {
	res.json(todos)
})

app.post('/register',(req, res)=>{
	const newUser = new User({
		username: req.body.username,
		password: req.body.password
	})
newUser.save().then(()=>{
	res.status(200).json({ success: true, newUser })

}).catch(err => {
	res.status(400).json({ success: false, message: 'Username already exists' })
})
})

app.post('/login', (req, res) => {
	User.findOne({ username: req.body.username })
		.then(registeredUser => {
			if (!registeredUser) {
				return res.status(400).json({ success: false, message: 'Unknown user' })
			}
			if (registeredUser.password === req.body.password) {
				res
					.status(200)
					.json({ success: true, message: 'Logged in successfully' })
			} else {
				res.status(400).json({ success: false, message: 'Wrong password' })
			}
		})
		.catch(error => {
			res.status(400).json({ success: false, message: 'Error finding user' })
		})
})


app.post('/add', (req, res) => {
	const task = req.body.task
	if (task) {
		const newTask = new Task({ todo: task })
		newTask
			.save()
			.then(() => res.status(200).json({ success: true, newTask }))
			.catch(err =>
				res.status(400).json({ success: false, message: 'Error saving task' })
			)
	} else {
		res.status(400).json({ success: false, message: 'task not found' })
	}
})


app.delete('/delete/:id', (req, res) => {
	const id = req.params.id
	Task.findByIdAndDelete(id).then(deletedTask =>{
if(!deletedTask){
	res.status(400).json({ success:true, message: 'Error deleting task' })
}
res.status(200).json({ success: false, message: 'Task deleted successfully' })
	}).catch(err=>{
		res.status(400).json({ success: false, message: 'Error deleting task' })
	})
})

app.put('/edit/:id', (req, res) => {
	const id = req.params.id
	const updatedTask = req.body.task

	Task.findByIdAndUpdate(id, { todo: updatedTask }, { new: true }) 
		.then(changedTask => {
			if (!changedTask) {
				return res
					.status(400)
					.json({ success: false, message: 'Error updating task' })
			}
			res.status(200).json({ success: true, updatedTask: changedTask }) 
		})
		.catch(error => {
			res.status(400).json({ success: false, message: 'Error updating task' })
		})
})


app.listen(port, () => {
	console.log(`server listening on port ${port}`)
})
