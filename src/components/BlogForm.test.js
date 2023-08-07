import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('<BlogForm /> calls event handler with correct details', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Why I love programming')
  await user.type(authorInput, 'Victor Adeoye')
  await user.type(urlInput, 'http://www.example.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Why I love programming')
  expect(createBlog.mock.calls[0][0].author).toBe('Victor Adeoye')
  expect(createBlog.mock.calls[0][0].url).toBe('http://www.example.com')
})