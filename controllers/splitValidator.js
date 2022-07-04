const { celebrate } = require('celebrate')
const Joi  = require('joi')

const validateTransactionObject = () => {
  const splitInfoValidation = Joi.object().keys({
    SplitType: Joi.valid('FLAT', 'RATIO', 'PERCENTAGE').required(), //Filter out incomplete payload
    SplitValue: Joi.number().positive().required(), //Filter out incomplete payload and negative amount
    SplitEntityId: Joi.string().required(), //Filter out incomplete payload
  })
  return celebrate({
    body: Joi.object({
      ID: Joi.number().required(), //Filter out incomplete payload
      Amount: Joi.number().positive().required(), //Filter out incomplete payload and negative amount
      Currency: Joi.string().required(), //Filter out incomplete payload
      CustomerEmail: Joi.string().email().required(), //Filter out incomplete payload
      SplitInfo: Joi.array().min(1).items(splitInfoValidation).min(1).max(20).required(), //Filter out incomplete payload and SplitInfo array of objects <1 || >20
    }),
  })
}

module.exports = { validateTransactionObject }