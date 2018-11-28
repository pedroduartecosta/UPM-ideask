module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/welcome',
      description: 'Display the welcome page for authenticated users.'
    },

  },

  welcome: function (req, res) {
  res.view('pages/dashboard/welcome', {layout: 'layouts/layout-ideas'})
  },


  fn: async function () {

    return {};

  }


};
