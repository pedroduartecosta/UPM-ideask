module.exports = {


  friendlyName: 'View all ideas',


  description: 'Display "All ideas" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/all-ideas'
    },

    invalid: {
      responseType: 'badRequest'
    },

  },


  fn: async function (inputs, exits) {

    //use the logged in users id if no userId was given
      const userId = this.req.session.userId
    

    //get the user
    const user = await User.findOne({
      id: userId
    })

    if (!user) {
      sails.log.info(`Could not find the logged in user with id ${userId}`)
      return exits.invalid()
    }


    //look up ideas of the specified user
    const ideas = await Idea.find().populate('owner').populate('upvoters').populate('downvoters')

    if (!ideas) {
      sails.log.info(`Could not find any ideas`)
      return exits.invalid()
    }

    sails.log.info(`Found ${ideas.length} ideas`)

    
    // Respond with view.
    return exits.success({
      user: user,
      ideas: ideas,
    });

  }


};
