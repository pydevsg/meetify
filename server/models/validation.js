const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    

    const schema = Joi.object({
      
        username: Joi.string().min(6).max(20).required(),
      
        email: Joi.string().min(6).max(100).required().email(),
      
        password: Joi.string().min(6).max(10).required(),
      
    });
      
    return schema.validate(data);
      
};

const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().email().min(6).max(100).required(),
        password: Joi.string().min(6).max(10).required(),
      })
      return schema.validate(data);
      
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;