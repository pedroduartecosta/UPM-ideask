var supertest = require('supertest');
var sails = require('sails')

var chai = require('chai')
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const validIdea = {
  title: 'New great idea!',
  description: 'Idea description',
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

    this.beforeEach(async () => {
      //clean database before testing
      const user = await User.create(validUser).fetch()
      validIdea.owner = user.id
    })

    this.afterAll(async () => {
      //clean database after testing
      return await Idea.destroy({}).fetch()
    })

    it('should succeed for valid input', async () => {
      // act assert
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
