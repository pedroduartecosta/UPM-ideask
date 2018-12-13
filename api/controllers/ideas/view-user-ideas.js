module.exports = {


  friendlyName: 'View user ideas',


  description: 'Display "User ideas" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/user-ideas'
    },

    invalid: {
      responseType: 'badRequest'
    },

  },


  fn: async function (inputs, exits) {

    //get user id from path
    let userId = this.req.param('id')

    //use the logged in users id if no userId was given
    if (!userId) {
      userId = this.req.session.userId
    }

    //get the user
    const user = await User.findOne({
      id: userId
    })

    //return if user could not be found
    if (!user) {
      sails.lof.warning(`User with id ${userId} was not found`)
      return exits.invalid()
    }


    sails.log.info(`Searching ideas for ${userId}`)

    //look up ideas of the specified user
    const ideas = await Idea.find({
      owner: userId
    }).populate('owner').populate('upvoters').populate('downvoters')

    sails.log.info(`Found ${ideas.length} ideas`)

    
    // Respond with view.
    return exits.success({
      user: user,
      ideas: ideas,
      loggedInUserId: this.req.session.userId
    });

  }

};
