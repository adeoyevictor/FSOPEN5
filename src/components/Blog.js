import React from 'react'

const Blog = ({ blog, likeBlog, user, handleDelete }) => {
  const [open, setOpen] = React.useState(false)
  const styles = {
    border: '1px solid black',
    marginBottom: 8,
    padding: 8
  }
  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete()
    }
  }
  return (
    <div style={styles} className="blog">
      {blog.title} {blog.author} <button onClick={() => setOpen(!open)} id='view-hide'>{open ? 'hide' : 'view'}</button>
      {open && <div>
        <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
              <div>likes <span id='blog-likes'>{blog.likes}</span> <button onClick={likeBlog} id='like-button'>like</button></div>
        <div>{blog?.user?.username}</div>
        {
          user.username === blog.user.username &&
          <button onClick={deleteBlog} id='remove'>remove</button>
        }
      </div>}
    </div >
  )
}

export default Blog