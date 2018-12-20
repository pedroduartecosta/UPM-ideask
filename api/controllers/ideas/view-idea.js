module.exports = {


  friendlyName: 'View idea',


  description: 'Display "Idea" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/idea'
    }

  },


  fn: async function (inputs, exits) {

    //get idea id from path
    let ideaId = this.req.param('id')

    //look up idea
    let idea = await Idea.findOne({id: ideaId}).populate('owner').populate("comments")

    if (!idea) {
      sails.lof.warning(`Idea with id ${ideaId} was not found`)
      return exits.invalid()
    }
    
    // Respond with view.
    return exits.success({
      idea: idea,
    });

  }

};
