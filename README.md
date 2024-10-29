# 📋 ToDo App

A simple and efficient ToDo application that allows users to manage tasks seamlessly. Users can register, log in, add tasks, and even receive their tasks via email.


## ✨ Features

- **User Registration and Authentication**: Create and log in to your account.
- **Task Management**: Add, edit, and delete tasks effortlessly.
- **View All Tasks**: Easily see your list of tasks.
- **Email Notifications**: Receive your tasks via email.
- **Data Security**: User data is securely stored using MongoDB.


## ⚙️Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT) for authentication
- Nodemailer for sending emails

Here's the complete installation section for your README, all in one code block:

## 🚀 Installation

To get started with the ToDo App, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   The server will start at [http://localhost:3000](http://localhost:3000).
```
