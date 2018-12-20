module.exports = {


  friendlyName: 'Upvote idea',


  description: '',


  inputs: {

  },


  exits: {
    success: {
      description: 'Idea was upvoted successfully.',
      responseType: 'redirect'
    },

    invalid: {
      responseType: 'badRequest'
    },
  },


  fn: async function (inputs, exits) {

    const userId = this.req.session.userId
    const user = await User.findOne({id: userId})
    if (!user) {
      sails.log.info(`Unable to get userId ${userId}`)
      console.log('user not found')
      return exits.invalid()
    }

    const ideaId = this.req.param('id')
    var idea = await Idea.findOne({id: ideaId}).populate('upvoters')
    if (!idea) {
      sails.log.info(`Unable to get idea ${ideaId}`)
      console.log(`Unable to get idea ${ideaId}`)
      return exits.invalid()
    }

    if (idea.upvoters && idea.upvoters.map(u => u.id).indexOf(userId) !== -1) {
      sails.log.info(`User already upvoted idea ${ideaId}`)
      console.log('already')
      return exits.invalid()
    }

    await Idea.addToCollection(idea.id, 'upvoters', user.id)
    await Idea.removeFromCollection(idea.id, 'downvoters', user.id)

    return exits.success('/ideas');


  }


};
