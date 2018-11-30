module.exports = {


  friendlyName: 'Delete idea',


  description: 'Delete Idea page.',

  inputs: {
    // id: {
    //   type: 'string',
    //   required: true,
    // }
  },

  exits: {

    success: {
      description: 'Idea was deleted successfully.',
      responseType: 'redirect'
    },

    invalid: {
      responseType: 'badRequest'
    },

  },


  fn: async function (inputs, exits) {

    const id = this.req.param('id')

    var removedIdea = await Idea.destroyOne({id: id});

    if (removedIdea) {
      return exits.success('/users/ideas');
    } else {
      return exits.invalid();
    }
  }

};
