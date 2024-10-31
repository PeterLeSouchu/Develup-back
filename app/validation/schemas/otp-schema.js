import Joi from 'joi';
import { otpSchema } from './inputs-schema';

export const otpSchema = Joi.object({
  userOTPcode: otpSchema,
});
