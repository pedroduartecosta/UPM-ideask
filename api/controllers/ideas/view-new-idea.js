module.exports = {


  friendlyName: 'New idea',


  description: 'New Idea page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/new-idea'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
