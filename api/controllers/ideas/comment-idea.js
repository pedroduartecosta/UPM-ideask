module.exports = {


  friendlyName: 'Comment idea',


  description: '',


  inputs: {
    content: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'Idea was commented successfully'
    },

    badRequest: {
      description: 'An unexpected error occured',
      responseType: 'badRequest'
    },

    ideaDoesNotExist: {
      description: 'Idea does not exist',
      responseType: 'badRequest'
    },

    notAuthorized: {
      description: 'Not authorized to comment this idea',
      responseType: 'forbidden',
      statusCode: 403
    }

  },


  fn: async function (inputs, exits) {

    //get logged in user
    const ideaId = this.req.param('id')

    //get the idea from the database
    let idea = await Idea.findOne({id: ideaId})
    if (!idea) {
      return exits.ideaDoesNotExist()
    }

    let newCommentRecord = await Comment.create({
      content: inputs.content,
      timestamp: Date().toString(),
      idea: idea.id,
      owner: this.req.me.id
    }).fetch();

    if (newCommentRecord) {
      sails.log.info(`successfully commented idea ${inputs.idea}`)
      return exits.success()
    } else {
      sails.log.info(`could not add comment`)
      return exits.badRequest()
    }
  }
};
