module.exports = {


  friendlyName: 'Downvote idea',


  description: '',


  inputs: {

  },


  exits: {
    success: {
      description: 'Idea was downvoted successfully.',
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
      return exits.invalid()
    }

    const ideaId = this.req.param('id')
    var idea = await Idea.findOne({id: ideaId}).populate('downvoters')
    if (!idea) {
      sails.log.info(`Unable to get idea ${ideaId}`)
      return exits.invalid()
    }

    if (idea.downvoters && idea.downvoters.map(u => u.id).indexOf(userId) !== -1) {
      sails.log.info(`User already downvoted idea ${ideaId}`)
      return exits.invalid()
    }

    await Idea.addToCollection(idea.id, 'downvoters', user.id)
    await Idea.removeFromCollection(idea.id, 'upvoters', user.id)

    return exits.success('/ideas');

  }


};
