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

    description: {
      type: 'string',
      maxLength: 1000,
      example: 'This solution will allow patients and doctors to share....'
    },

    rating: {
      type: 'number',
      isInteger: true,
      min: 0,
      max: 5,
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


  fn: async function () {

    // Respond with view.
    return {};

  }


};
