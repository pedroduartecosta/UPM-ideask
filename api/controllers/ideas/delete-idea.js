module.exports = {


  friendlyName: 'Edit idea',


  description: 'Edit Idea page.',

  inputs: {
    id: {
      type: 'string',
      required: true,
    }
  },

  exits: {

    success: {
      description: 'New idea was created successfully.'
    },

    invalid: {
      responseType: 'badRequest'
    },

  },


  fn: async function (inputs, exits) {

    var removedIdea = await Idea.destroyOne({id: inputs.id});

    if (removedIdea) {
      return exits.success();
    } else {
      return exits.invalid();
    }
  }

};
