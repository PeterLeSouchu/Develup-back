import Joi from 'joi';
import { otpSchema } from '../inputs-schema.js';

const otpSignupSchema = Joi.object({
  userOTPcode: otpSchema,
});

export default otpSignupSchema;
