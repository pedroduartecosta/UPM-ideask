module.exports = {


  friendlyName: 'New idea',


  description: 'New Idea page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/ideas/new-idea'
    }

  },


  fn: async function () {

    let user = this.req.me;

    if (user == null) {
      throw {
        redirect: '/'
      };
    }

    return {
      user: user
    };

  }


};
