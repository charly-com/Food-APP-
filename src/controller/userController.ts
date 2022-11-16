import express, {Request, Response} from 'express';
import { registerSchema, options, GeneratePassord, GenerateSalt, GenerateOTP, onRequestOTP, emailHtml, Mailsend, GenerateSignature} from '../utils';
import {UserAttributes, UserInstance} from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';
import {fromAdminMail, userSubject} from '../config';


export const Register = async (req:Request, res:Response) => {
  try {
    const { email, password, confirm_password, phone} = req.body
    const uuiduser = uuidv4();
    const validateResult = registerSchema.validate(req.body, options);
    if(validateResult.error) {
        res.status(400).json({
            Error:validateResult.error.details[0].message
        })
    }
    // generate salt
    const salt = await GenerateSalt();
    const userPasword = await GeneratePassord(password, salt);

    //generate otp
    const {otp,expiry} = GenerateOTP();

    // check if user exist
    const User = await UserInstance.findOne({where: { email:email } });
    
    //Create User
    if(!User) {
      let user = await UserInstance.create({
        id: uuiduser, 
        email, 
        phone, 
        password: userPasword, 
        firstName: '',
        lastName: '', 
        salt, 
        address: '', 
        otp, 
        otp_expiry: expiry, 
        lng: 0, 
        lat: 0, 
        verified: false
      })
      // send otp
      await onRequestOTP(otp, phone);
      
      // send email
      const html = emailHtml(otp);
    
      await Mailsend(fromAdminMail, email, userSubject, html);
      // check if user is created
      const User = await UserInstance.findOne({where: { email:email } }) as unknown as UserAttributes;
      
      //Generate Token
      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified
      })


      return res.status(201).json({
        message: 'User created successfully',
        signature
      })
    }
    return res.status(400).json({
      message: 'User already exist',
    })
    
  } catch(err) {
     res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/signup"
     })
  }
}