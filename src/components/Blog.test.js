import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('<Blog /> renders correctly', () => {
  const blog = {
    title: 'Why I love programming',
    author: 'Victor Adeoye',
    url: 'http://www.example.com',
    likes: 0,
    user: { username: 'cheekzy' }
  }
  const user = { username: 'cheekzy' }

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Why I love programming')
  expect(div).toHaveTextContent('Victor Adeoye')
  expect(div).not.toHaveTextContent('0')
  expect(div).not.toHaveTextContent('http://www.example.com')
})

test('<Blog /> shows url and likes', async () => {
  const blog = {
    title: 'Why I love programming',
    author: 'Victor Adeoye',
    url: 'http://www.example.com',
    likes: 0,
    user: { username: 'cheekzy' }
  }
  const user = { username: 'cheekzy' }

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.blog')
  const clicker = userEvent.setup()
  const button = screen.getByText('view')
  await clicker.click(button)


  expect(div).toHaveTextContent('0')
  expect(div).toHaveTextContent('http://www.example.com')
})

test('<Blog /> clicking like twice calls event handler twice', async () => {
  const blog = {
    title: 'Why I love programming',
    author: 'Victor Adeoye',
    url: 'http://www.example.com',
    likes: 0,
    user: { username: 'cheekzy' }
  }
  const user = { username: 'cheekzy' }
  const mockHandler = jest.fn()
  render(<Blog blog={blog} user={user} likeBlog={mockHandler} />)

  const clicker = userEvent.setup()

  const viewButton = screen.getByText('view')
  await clicker.click(viewButton)

  const likeButton = screen.getByText('like')
  await clicker.click(likeButton)
  await clicker.click(likeButton)


  expect(mockHandler.mock.calls).toHaveLength(2)
})