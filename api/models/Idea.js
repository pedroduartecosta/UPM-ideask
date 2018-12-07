/**
 * Idea.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id: { 
      type: 'string', 
      columnName: '_id' 
    },

    title: {
      type: 'string',
      required: true,
      maxLength: 200,
      example: 'New solution to store medical records with blockchain techonology.'
    },

    subtitle: {
      type: 'string',
      maxLength: 400,
      example: 'This solution will allow patients and doctors to share....'
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
    
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // Add a reference to User
    owner: {
      model: 'user'
    },

    comments: {
      collection: 'comment',
      via: 'idea'
    }

  },

};

