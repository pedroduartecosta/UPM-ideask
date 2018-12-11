var supertest = require('supertest');

var sails = require('sails')

var chai = require('chai')
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const expect = chai.expect

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

describe('Vote ideas', function () {

    var idea1 = null

    var agent = undefined
    var user = undefined
    
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

    this.beforeEach(async () => {

      //clean ideas
      await Idea.destroy({}).fetch()

      //save idea for first user
      idea1 = await Idea.create({
        title: validIdea.title,
        subtitle: validIdea.subtitle,
        description: validIdea.description,
        notes: validIdea.notes,
        owner: user.id
      }).fetch()

      //save idea for second user
      return await Idea.create({
        title: secondValidIdea.title,
        subtitle: secondValidIdea.subtitle,
        description: secondValidIdea.description,
        notes: secondValidIdea.notes,
        owner: user.id
      }).fetch()
    }),

    it('upvote should succeed', async () => {
      return await agent
          .get(`/api/v1/ideas/${idea1.id}/upvote`)
          .expect(302)
    }),

    it('upvote should fails for second upvote', async () => {
      await agent
          .get(`/api/v1/ideas/${idea1.id}/upvote`)
          .expect(302)

      await agent
          .get(`/api/v1/ideas/${idea1.id}/upvote`)
          .expect(400)
    }),

    it('downvote should succeed', async() => {
      return await agent
          .get(`/api/v1/ideas/${idea1.id}/downvote`)
          .expect(302)
    }),

    it('downvote should fails for second upvote', async () => {
      await agent
          .get(`/api/v1/ideas/${idea1.id}/downvote`)
          .expect(302)

      await agent
          .get(`/api/v1/ideas/${idea1.id}/downvote`)
          .expect(400)

    })

  })