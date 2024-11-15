import Joi from 'joi';
import {
  titleSchema,
  rhythmSchema,
  descriptionSchema,
} from '../inputs-schema.js';

const projectSchema = Joi.object({
  title: titleSchema,
  rhythm: rhythmSchema,

  description: descriptionSchema,
});
export default projectSchema;
