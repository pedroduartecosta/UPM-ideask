module.exports = {


  friendlyName: 'View idea',


  description: 'Display "Idea" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/idea'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
