var supertest = require('supertest');
var sails = require('sails')

var chai = require('chai')
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const validIdea = {
  title: 'New great idea!',
  subtitle: 'Best subtitle ever.',
  description: 'Idea description.',
  notes: 'This is a note that I keep to my self, regarding future implementations of my idea.'
}

const validUser = {
  emailAddress: 'walter@white.com',
  firstName: 'Walter',
  lastName: 'White',
  password: 'ww'
}

const invalidIdea = {
  description: "Idea description"
}

describe('EntranceController', function () {

  describe('Create idea', () => {

    this.beforeAll(async () => {
      //clean database before testing
    })

    this.afterEach(async () => {
      //clean database after testing
      return await User.destroy({}).fetch()
    })

    this.afterAll(async () => {
      //clean database after testing
      await User.destroy({}).fetch()
      return await Idea.destroy({}).fetch()
    })

    it('should succeed for valid input', async () => {
      //arrange
      //create a valid record in the database
      const hashedPassword = await sails.helpers.passwords.hashPassword(validUser.password)
      const userToCreate = {
          emailAddress: validUser.emailAddress,
          password: hashedPassword,
          firstName: validUser.firstName,
          lastName: validUser.lastName
      }

      const user = await User.create(userToCreate).fetch()
      if (!user) {
          throw new Error('Creating user failed')
      }
      await supertest(sails.hooks.http.app)
              .put('/api/v1/entrance/login')
              .send({
                  emailAddress: validUser.emailAddress,
                  password: validUser.password
              })
              .expect(200)

      //act assert
      return await supertest(sails.hooks.http.app)
          .post('/api/v1/ideas/new-idea')
          .send(validIdea)
          .expect(200)
    }),

    it('should fail for invalid input', async () => {
      // act assert
      return await supertest(sails.hooks.http.app)
        .post('/api/v1/ideas/new-idea')
        .send(invalidIdea)
        .expect(400)
    })


  })

});
