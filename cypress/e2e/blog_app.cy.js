describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'Adeoye Victor',
      username: 'cheekzy',
      password: 'goxtreme'
    }
    const user2 = {
      name: 'John Doe',
      username: 'dummy',
      password: 'password'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('cheekzy')
      cy.get('#password').type('goxtreme')
      cy.get('#login-button').click()

      cy.contains('cheekzy logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('cheekzy')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
      cy.get('html').should('not.contain', 'cheekzy logged in')
    })

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({ username:'cheekzy', password:'goxtreme' })
      })

      it('A blog can be created', function () {
        cy.contains('new blog').click()
        cy.get('#title').type('Why I love coding')
        cy.get('#author').type('Adeoye Victor')
        cy.get('#url').type('http://www.example.com')

        cy.contains('create').click()

        cy.contains('a new blog Why I love coding by Adeoye Victor added')
        cy.contains('Why I love coding')
        cy.contains('Adeoye Victor')
      })

      describe('when a blog exists', function() {
        beforeEach(function () {
          cy.createBlog({
            title: 'Why I love coding',
            author: 'Adeoye Victor',
            url: 'http://www.example.com'
          })
        })

        it('it can be liked', function() {
          cy.get('#view-hide').click()
          cy.get('#like-button').click()

          cy.get('#blog-likes').contains('1')
        })

        it('it can be deleted', function() {
          cy.get('#view-hide').click()
          cy.get('#remove').click()
          cy.contains('Why I love coding Adeoye Victor').should('not.exist')
        })

        it('only creator can see delete button', function() {
          cy.login({ username: 'dummy', password: 'password' })
          cy.get('#view-hide').click()
          cy.get('#remove').should('not.exist')
        })

        describe('when two blogs exist and second is most liked', function() {
          beforeEach(function () {
            cy.createBlog({
              title: 'I am awesome',
              author: 'Albert Einstein',
              url: 'http://www.twitter.com'
            })
            cy.get('.blog:last').as('secondBlog')
            cy.get('@secondBlog').contains('view').click()
            cy.get('@secondBlog').get('#like-button').click()

          })

          it('second blog comes first', function() {
            cy.get('.blog').eq(0).should('contain', 'I am awesome')
            cy.get('.blog').eq(1).should('contain', 'Why I love coding')
          })
        })
      })
    })
  })
})