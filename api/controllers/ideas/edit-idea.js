module.exports = {


  friendlyName: 'Edit idea',


  description: '',


  inputs: {

    id: {
      required: true,
      type: 'string'
    },

    title: {
      required: true,
      type: 'string'
    },

    subtitle: {
      required: true,
      type: 'string'
    },

    description: {
      required: true,
      type: 'string'
    },

    notes: {
      required: true,
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'Idea was edited successfully'
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
      description: 'Not authorized to edit this idea',
      responseType: 'redirect'
    }

  },


  fn: async function (inputs, exits) {

    //get logged in user
    const userId = this.req.session.userId

    //get the idea from the database
    let idea = await Idea.findOne({id: inputs.id})
    if (!idea) {
      return exits.ideaDoesNotExist()
    }

    //check if the user is authorized to edit it
    if (idea.owner.toString() !== userId) {
      return exits.notAuthorized('/')
    }

    //update the idea
    let updatedIdea = await Idea.updateOne({ id: idea.id })
                                .set({
                                  title: inputs.title,
                                  subtitle: inputs.subtitle,
                                  description: inputs.description,
                                  notes: inputs.notes
                                });

    if (updatedIdea) {
      sails.log.info(`successfully updated idea ${inputs.id}`)
      return exits.success()
    } else {
      sails.log.info(`could not update idea ${inputs.id}`)
      return exits.badRequest()
    }

  }


};
