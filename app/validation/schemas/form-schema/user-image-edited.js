import Joi from 'joi';
import { imageSchema } from '../inputs-schema.js';

const userImageEditedSchema = Joi.object({
  image: imageSchema,
});

export default userImageEditedSchema;
