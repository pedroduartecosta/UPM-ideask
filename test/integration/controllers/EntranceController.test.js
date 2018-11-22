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

const userWithWrongProperties = {
    f:'Walter',
    l:'White',
    e:'walter@white.com',
    p:'ww'
}

const notExistingEmail = 'jessie@pinkman.com'
const notMatchingPassword = 'jp'

describe('EntranceController', function() {

    this.beforeEach(async () => {
        //clean database before testing
        return await User.destroy({}).fetch()
      })
    
    this.afterAll(async () => {
        //clean database after testing
        return await User.destroy({}).fetch()
    })

    describe('#register()', () => {

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
                            .send(userWithWrongProperties)
                            .expect(400)
        })
    }),

    describe('#login()', () => {

        this.afterEach(async () => {
            //clean database after testing
            return await User.destroy({}).fetch()
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

            //act assert
            return await supertest(sails.hooks.http.app)
                            .put('/api/v1/entrance/login')
                            .send({
                                emailAddress: validUser.emailAddress,
                                password: validUser.password
                            })
                            .expect(200)
        }),

        it('should fail for not existing user', async () => {
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

            //act assert
            return await supertest(sails.hooks.http.app)
                            .put('/api/v1/entrance/login')
                            .send({
                                emailAddress: notExistingEmail,
                                password: validUser.password
                            })
                            .expect(401)
        }),

        it('should fail for bad password/username combination', async() => {
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

            //act assert
            return await supertest(sails.hooks.http.app)
                            .put('/api/v1/entrance/login')
                            .send({
                                emailAddress: validUser.emailAddress,
                                password: notMatchingPassword
                            })
                            .expect(401)
        })

    }),

    describe('#logout()', () => {

        this.afterEach(async () => {
            //clean database after testing
            return await User.destroy({}).fetch()
        })

        it('should succeed for a logged in user', async () => {

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
            await supertest(sails.hooks.http.app)
                        .get('/api/v1/account/llogout')
                        .expect(200)

            return await supertest(sails.hooks.http.app)
                        .get('/welcome/')
                        .expect(401)
        })

    })

});