document.addEventListener('DOMContentLoaded', function () {
	const todoList = document.querySelector('.task-list') 
	const input = document.querySelector('input')
	const form = document.querySelector('form')

	function deleteTask(id) {
		fetch(`/delete/${id}`, {
			method: 'DELETE',
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					fetchToDos()
				}
			})
	}

 function updateTask(id) {
		const newTask = prompt('Edit your task:') 
		if (newTask) {
			fetch(`/edit/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ task: newTask }),
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						fetchToDos()
					}
				})
		}
 }


	function fetchToDos() {
		fetch('/todos')
			.then(response => response.json())
			.then(data => {
				todoList.innerHTML = ''
				data.forEach(todo => {
					const li = document.createElement('li')
          li.classList.add('task')        
					li.innerHTML = `${todo.task} `
					const deleteButton = document.createElement('button')
					deleteButton.textContent = 'Delete Task'
          deleteButton.classList.add('task-btn') 
					deleteButton.addEventListener('click', () => deleteTask(todo.id)) 
					li.appendChild(deleteButton)
          const editButton = document.createElement('button')
          editButton.textContent = "Edit Task"
          editButton.classList.add('task-btn') 
          editButton.addEventListener('click', () => updateTask(todo.id))
li.appendChild(editButton)

					todoList.appendChild(li)
				})
			})
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault()
		const task = input.value

		fetch('/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ task }),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					input.value = '' 
					fetchToDos() 
				}
			})
	})

	fetchToDos() 
})
