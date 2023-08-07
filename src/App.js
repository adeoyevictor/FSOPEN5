import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const newBlogRef = useRef()

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const handleCreate = async (blogObject) => {
    newBlogRef.current.toggleVisibility()
    try {
      const blog = await blogService.create(blogObject)
      console.log(blog)
      const user_id = blog.user
      delete blog.user
      blog.user = {
        username: user.username,
        name: user.name,
        id: user_id
      }
      console.log(blog)
      setBlogs(prevBlogs => prevBlogs.concat(blog))
      setMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error)
    }
  }
  const likeBlog = async (id, blog) => {
    try {
      const newBlog = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      const updatedBlog = await blogService.update(id, newBlog)
      console.log(updatedBlog)
      setBlogs(prevBlogs => prevBlogs.map(blog => blog.id === id ? updatedBlog : blog))
    } catch (error) {
      console.log(error)
    }
  }
  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.log(error)
    }
  }
  const blogsToShow = blogs.sort((a, b) => b.likes - a.likes)
  if (user === null) {
    return <div>
      <h2>Log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
                    username
          <input
            type='text'
            value={username}
            name='username'
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
                    password
          <input
            type='password'
            value={password}
            name='password'
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' id='login-button'>
                    login
        </button>
      </form>
    </div>
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />

      <p>{user.username} logged in <button onClick={handleLogout}>Logout</button></p>

      <Togglable buttonLabel='new blog' ref={newBlogRef}>
        <BlogForm createBlog={handleCreate} />
      </Togglable>

      {blogsToShow.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={() => likeBlog(blog.id, blog)} user={user} handleDelete={() => handleDelete(blog.id)} />
      )}
    </div>
  )
}

export default App