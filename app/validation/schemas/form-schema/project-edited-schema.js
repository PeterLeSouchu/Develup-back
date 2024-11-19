import Joi from 'joi';
import {
  titleSchemaEdited,
  rhythmSchemaEdited,
  descriptionSchemaEdited,
  technoSchema,
  imageSchema,
} from '../inputs-schema.js';

const projectSchemaEditeded = Joi.object({
  title: titleSchemaEdited,
  rhythm: rhythmSchemaEdited,
  techno: technoSchema,
  description: descriptionSchemaEdited,
  image: imageSchema,
});
export default projectSchemaEditeded;