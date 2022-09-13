const Validator = require('validatorjs');
// const Users = require('../models/users');
// Validator.register('email_unique', value => true, 'The email field must be unique');

// async function checkEmailIsUnique(email){
//     let data = await Users.count({ where: { email: email.toString().toLowerCase() } });
//     console.log("count status", data < 1 ? false : true)
//     return data < 1 ? false : true;
// }

const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;