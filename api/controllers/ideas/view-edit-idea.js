module.exports = {


  friendlyName: 'View edit idea',


  description: 'Display "Edit idea" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/edit-idea'
    },

    invalidId: {
      description: 'Invalid path parameters',
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

    //get user id from path
    let ideaId = this.req.param('id')

    //use the logged in users id if no userId was given
    if (!ideaId) {
      return exits.invalidId()
    }

    //get logged in user
    const userId = this.req.session.userId

    //get the idea from the database
    const idea = await Idea.findOne({id: ideaId})
    if (!idea) {
      return exits.ideaDoesNotExist()
    }

    //check if the user is authorized to edit it
    if (idea.owner.toString() !== userId) {
      return exits.notAuthorized('/')
    }

    // Respond with view.
    return exits.success({
      user: this.req.me,
      formData: idea
    })

  }


};
