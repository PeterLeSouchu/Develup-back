import Joi from 'joi';
import {
  pseudoSchemaEdited,
  typeSchemaEdited,
  descriptionSchemaEdited,
  technoSchema,
  imageSchema,
} from '../inputs-schema.js';

const profileEditedSchema = Joi.object({
  pseudo: pseudoSchemaEdited,
  type: typeSchemaEdited,
  techno: technoSchema,
  description: descriptionSchemaEdited,
  image: imageSchema,
});
export default profileEditedSchema;
