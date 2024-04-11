import Joi from 'joi';

export const CreateProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().integer().min(0).required(),
  count: Joi.number().integer().min(0).required(),
});