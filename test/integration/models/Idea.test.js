var util = require('util');

var chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const expect = chai.expect

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

describe('Idea (model)', function() {

  this.beforeAll(async () => {
    //Create a user to create de edit
    const user = await User.create(validUser).fetch()
    validIdea.owner = user.id
  })

  this.afterAll(async () => {
    //clean database after testing
    await User.destroy({}).fetch()
    return await Idea.destroy({}).fetch()
  })

  it('should be created successfully', async () => {
    //act
    const idea = await Idea.create(validIdea).fetch()

    //assert
    expect(idea).to.not.equal(undefined)
    expect(idea).to.containSubset(validIdea)
  }),

  it('should fail for invalid properties', (done) => {
    Idea.create(invalidIdea).then(idea => {
      console.log('idea: ' + idea)
      return done(new Error('Did not fail'))
    })
    .catch((error) => {
      return done()
    })
  })
});