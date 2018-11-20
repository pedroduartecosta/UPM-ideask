var supertest = require('supertest');
var sails = require('sails')

var chai = require('chai')
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const validUser = {
    firstName:'Walter',
    lastName:'White',
    emailAddress:'walter@white.com',
    password:'ww'
}

const invalidUser = {
    f:'Walter',
    l:'White',
    e:'walter@white.com',
    p:'ww'
}

describe('EntranceController', function() {

    describe('#register()', () => {

        this.beforeEach(async () => {
            //clean database before testing
            return await User.destroy({}).fetch()
          })
        
        this.afterAll(async () => {
        //clean database after testing
        return await User.destroy({}).fetch()
        })

        it('should succeed for valid input', async () => {
            // act assert
            return await supertest(sails.hooks.http.app)
                            .post('/api/v1/entrance/signup')
                            .send(validUser)
                            .expect(200)
        }),

        it ('should fail for existing email', async () => {
            // arrange
            const user = await User.create(validUser).fetch()

            // act assert
            return await supertest(sails.hooks.http.app)
                            .post('/api/v1/entrance/signup')
                            .send(validUser)
                            .expect(409)
        }),

        it ('should fail for invalid input', async () => {
            // act assert
            return await supertest(sails.hooks.http.app)
                            .post('/api/v1/entrance/signup')
                            .send(invalidUser)
                            .expect(400)
        })


    })

});