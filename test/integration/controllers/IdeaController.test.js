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

const secondValidIdea = {
  title: 'Second great idea!',
  subtitle: 'Second best subtitle ever.',
  description: 'Second idea description.',
  notes: 'This is a note that I keep to my self, regarding future implementations of my second idea.'
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

describe('IdeaController', function () {

  var agent = undefined
  var user = undefined
  var idea = undefined
  
  this.beforeAll(async () => {
    //clean database before testing

    await Idea.destroy({}).fetch()
    await User.destroy({}).fetch()

    const hashedPassword = await sails.helpers.passwords.hashPassword(validUser.password)

    user = await User.create({ 
      emailAddress: validUser.emailAddress,
      password: hashedPassword,
      firstName: validUser.firstName,
      lastName: validUser.lastName
      }).fetch()

    agent = supertest.agent(sails.hooks.http.app)
    await agent.put('/api/v1/entrance/login')
                      .send(
                        {
                          emailAddress: validUser.emailAddress,
                          password: validUser.password
                        }
                      )
                      .expect(200)
  })


  this.afterAll(async () => {
    //clean database after testing
    await User.destroy({}).fetch()
    return await Idea.destroy({}).fetch()
  })

  describe('Create idea', () => {

    it('should succeed for valid input', async () => {

      //act assert
      return await agent
          .post('/api/v1/ideas/new-idea')
          .send(validIdea)
          .expect(200)
    }),

    it('should fail for invalid input', async () => {
      // act assert
      return await agent
        .post('/api/v1/ideas/new-idea')
        .send(invalidIdea)
        .expect(400)
    })


  }),

  describe('Delete idea', () => {

    this.beforeAll(async () => {

      await Idea.destroy({}).fetch()

      idea = await Idea.create({ 
        title: validIdea.title,
        subtitle: validIdea.subtitle,
        description: validIdea.description,
        notes: validIdea.notes
      }).fetch()
    }),

    it('should succeed for existing idea', async () => {

      //act assert
      return await agent
        .post('/api/v1/ideas/delete')
        .send({id: idea.id})
        .expect(200)
    }),

    it('should fail for already deleted idea', async () => {
      // act assert
      return await agent
        .post('/api/v1/ideas/delete')
        .send({id: idea.id})
        .expect(400)
    })


  }),

  describe('List ideas for user', () => {

    this.beforeAll(async () => {

      await Idea.create({
        title: validIdea.title,
        subtitle: validIdea.subtitle,
        description: validIdea.description,
        notes: validIdea.notes,
        owner: user.id
      })

      return await Idea.create({
        title: secondValidIdea.title,
        subtitle: secondValidIdea.subtitle,
        description: secondValidIdea.description,
        notes: secondValidIdea.notes,
        owner: user.id
      })
    }),


    it('should succeed for logged in user', async () => {

      return await agent
          .get('/users/ideas')
          .expect(200)

    }),

    it('should succeed for given user id', async () => {

      return await agent
            .get(`/users/${user.id}/ideas`)
            .expect(200)

    })


  })

});
