import express, {Request, Response} from 'express';
import { registerSchema, options, GeneratePassord, GenerateSalt } from '../utils/utils';

export const Register = async (req:Request, res:Response) => {
  try {
    const { email, password, confirm_password, phone} = req.body
    const validateResult = registerSchema.validate(req.body, options);
    if(validateResult.error) {
        res.status(400).json({
            Error:validateResult.error.details[0].message
        })
    }
    // generate salt
    const salt = await GenerateSalt();
    const userPasword = await GeneratePassord(password, salt);
    
  } catch(err) {
     res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/signup"
     })
  }
}