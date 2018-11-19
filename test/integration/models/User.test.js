var util = require('util');

var chai = require('chai')
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const expect = chai.expect

const validUser = {
  emailAddress: 'walter@white.com',
  firstName: 'Walter',
  lastName: 'White',
  password: 'ww'
}

const invalidUser = {
  e: 'walter@white.com',
  f: 'Walter',
  l: 'White',
  p: 'ww'
}

describe('User (model)', function() {

  this.beforeEach(async () => {
    //clean database before testing
    return await User.destroy({}).fetch()
  })

  this.afterAll(async () => {
    //clean database after testing
    return await User.destroy({}).fetch()
  })

  it('should be created successfully', async () => {
    //act
    const user = await User.create(validUser).fetch()

    //assert
    expect(user).to.not.equal(undefined)
    expect(user).to.containSubset(validUser)
  }),

  it('should fail for invalid properties', (done) => {
    User.create(invalidUser).then(user => {
      console.log('user: ' + user)
      return done(new Error('Did not fail'))
    })
    .catch((error) => {
      return done()
    })
  }),

  it('should fail for existing email', (done) => {
    User.create(validUser).then(user => {
      User.create(validUser).then(user => {
        return done(new Error('Did not fail'))
      })
      .catch((error) => {
        return done()
      })      
    })
    .catch((error) => {
      return done(new Error('Did not create first user'))
    })
  })
});