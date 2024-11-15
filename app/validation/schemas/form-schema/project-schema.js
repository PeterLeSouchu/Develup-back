import Joi from 'joi';
import {
  titleSchema,
  rhythmSchema,
  descriptionSchema,
  technoSchema,
  imageSchema,
} from '../inputs-schema.js';

const projectSchema = Joi.object({
  title: titleSchema,
  rhythm: rhythmSchema,
  techno: technoSchema,
  description: descriptionSchema,
  image: imageSchema,
});
export default projectSchema;
