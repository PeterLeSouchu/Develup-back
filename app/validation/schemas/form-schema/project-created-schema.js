import Joi from 'joi';
import {
  titleSchemaCreated,
  rhythmSchemaCreated,
  descriptionSchemaCreated,
  technoSchema,
  imageSchema,
} from '../inputs-schema.js';

const projectCreatedSchema = Joi.object({
  title: titleSchemaCreated,
  rhythm: rhythmSchemaCreated,
  techno: technoSchema,
  description: descriptionSchemaCreated,
  image: imageSchema,
});
export default projectCreatedSchema;
