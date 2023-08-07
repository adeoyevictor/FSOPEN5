import React from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = React.useState('')
  const [author, setAuthor] = React.useState('')
  const [url, setUrl] = React.useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleSubmit}>
        <div>
                    title
          <input
            type='text'
            value={title}
            name='title'
            placeholder='title'
            id='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
                    author
          <input
            type='text'
            value={author}
            name='author'
            placeholder='author'
            id='author'
            onChange={({ target }) => setAuthor(target.value)}
          /></div>
        <div>
                    url
          <input
            type='text'
            value={url}
            name='url'
            placeholder='url'
            id='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm