import Joi from 'joi';
import bcrypt from 'bcrypt';
import {AuthPayload} from '../interface'
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';


 export const registerSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('confirm password')
    .messages({'any.only': '{{#label}} does not match'}),
   
})

export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };

export const GenerateSalt = async() => {
    return await bcrypt.genSalt();
  }

export const GeneratePassord = async (password:string, salt:string) => {
    return await bcrypt.hash(password,salt);
  }


export const GenerateSignature = async(payload:AuthPayload) => {
  return jwt.sign(payload,APP_SECRET, {expiresIn: '1d'});
}