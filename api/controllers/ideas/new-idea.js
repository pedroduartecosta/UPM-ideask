module.exports = {


  friendlyName: 'Edit idea',


  description: 'Edit Idea page.',

  inputs: {
    title: {
      type: 'string',
      required: true,
      maxLength: 200,
      example: 'New solution to store medical records with blockchain techonology.'
    },
    subtitle: {
      type: 'string',
      required: true,
      maxLength: 400,
      example: 'New solution to store medical records with blockchain techonology.'
    },
    description: {
      type: 'string',
      maxLength: 1000,
      example: 'This solution will allow patients and doctors to share....'
    },
    notes: {
      type: 'string',
      maxLength: 1000,
      example: 'This solution will allow patients and doctors to share....'
    },
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

    var newIdeaRecord = await Idea.create({
      title: inputs.title,
      subtitle: inputs.subtitle,
      description: inputs.description,
      notes: inputs.notes
    })
    .fetch();

    setTimeout(function () {
      return exits.success();
    }, 4000);
  }

};
