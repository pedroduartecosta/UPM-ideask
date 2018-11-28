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

const editedIdea = {
  title: 'Edited great idea!',
  subtitle: 'Edited best subtitle ever.',
  description: 'Edited idea description.',
  notes: 'This is a note that I keep to my self, regarding future implementations of my edited idea.'
}

const validUser = {
  emailAddress: 'walter@white.com',
  firstName: 'Walter',
  lastName: 'White',
  password: 'ww'
}

const secondValidUser = {
  emailAddress: 'jessie@pinkman.com',
  firstName: 'Jessie',
  lastName: 'Pinkman',
  password: 'jp'
}

const invalidIdea = {
  description: "Idea description"
}

describe('IdeaController', function () {

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


  }),

  describe('Edit ideas', () => {

    var firstIdeaModel = undefined
    var secondIdeaModel = undefined

    var secondUser = undefined

    this.beforeAll(async () => {
      //create second user in db
      const hashedPassword = await sails.helpers.passwords.hashPassword(secondValidUser.password)
      secondUser = await User.create({ 
        emailAddress: secondValidUser.emailAddress,
        password: hashedPassword,
        firstName: secondValidUser.firstName,
        lastName: secondValidUser.lastName
        }).fetch()

        return
    })

    this.beforeEach(async () => {
      //clean ideas
      await Idea.destroy({}).fetch()

      //save idea for first user
      firstIdeaModel = await Idea.create({
        title: validIdea.title,
        subtitle: validIdea.subtitle,
        description: validIdea.description,
        notes: validIdea.notes,
        owner: user.id
      }).fetch()

      //save idea for second user
      secondIdeaModel = await Idea.create({
        title: secondValidIdea.title,
        subtitle: secondValidIdea.subtitle,
        description: secondValidIdea.description,
        notes: secondValidIdea.notes,
        owner: secondUser.id
      }).fetch()

      return
    }),

    it('should succeed for own idea and valid input', async () => {

      //act
      await agent.put(`/api/v1/ideas/` + firstIdeaModel.id)
                        .send({
                          title: editedIdea.title,
                          subtitle: editedIdea.subtitle,
                          description: editedIdea.description,
                          notes: editedIdea.notes
                        })
                        .expect(200)

      //assert
      const idea = await Idea.findOne({id: firstIdeaModel.id})
      expect(idea).to.containSubset(editedIdea)
      
      return
    }),

    it('should fail for own idea but invalid input', async () => {

      //act
      await agent.put(`/api/v1/ideas/` + firstIdeaModel.id)
                  .send({
                    title: editedIdea.title,
                    subtitle: editedIdea.subtitle,
                    description: editedIdea.description,
                    notes: editedIdea.notes
                  })
                  .expect(400)

      //assert
      const idea = await Idea.findOne({id: firstIdeaModel.id})
      expect(idea).to.containSubset(validIdea)
      
      return

    }),

    it('should fail for someone elses idea and valid input', async () => {

      //act
      await agent.put(`/api/v1/ideas/` + secondIdeaModel.id)
                        .send({
                          title: editedIdea.title,
                          subtitle: editedIdea.subtitle,
                          description: editedIdea.description,
                          notes: editedIdea.notes
                        })
                        .expect(400)

      //assert
      const idea = await Idea.findOne({id: firstIdeaModel.id})
      expect(idea).to.containSubset(validIdea)
      
      return
    })

  })

});
