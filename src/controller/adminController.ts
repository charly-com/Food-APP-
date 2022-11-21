import express, { Request, Response } from 'express';
import { adminSchema, GenerateOTP, GeneratePassord, GenerateSalt, GenerateSignature,  options, vendorSchema } from '../utils';
import { UserAttributes, UserInstance } from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';

import Jwt, { JwtPayload } from 'jsonwebtoken';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';


export const adminRegister = async (req: JwtPayload, res: Response) => {
    try{
        const id = req.User.id
        const {email, phone, password, firstName, lastName, address} = req.body
        const uuidUser = uuidv4()
        const validateResult = adminSchema.validate(req.body, options)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
//Generate salt
const salt = await GenerateSalt()
const adminPassword = await GeneratePassord(password, salt)
console.log(adminPassword)
//Generate OTP
const {otp, expiry} = GenerateOTP()
//Check if the admin already exists
//Anytime you are using a schema or model, always await it
const Admin = await UserInstance.findOne(
    {where: {id:id}}) as unknown as UserAttributes
    //Create User
if(Admin.email === email){
    return res.status(400).json({
        Error: 'Email already exists'
    })
}
if(Admin.phone === phone){
    return res.status(400).json({
        Error: 'Phone Number already exists'
    })
}
    if(Admin.role==="superadmin"){
        const user = await UserInstance.findOne({where: {email:email}}) as unknown as UserAttributes;
        if(!user){
            await UserInstance.create({
            id: uuidUser,
            email,
            password: adminPassword,
            firstName,
            lastName,
            salt,
            address,
            phone,
            otp,
            otp_expiry:expiry,
            lng: 0,
            lat: 0,
            verified: true,
            role: 'admin'
        })
            //Check if Admin is created
            //Const user returns an instance of the user that is why we said as unknown as UserAttributes
        const Admin = await UserInstance.findOne({where: {id:id}}) as unknown as UserAttributes
                //Generate signature
              let signature = await GenerateSignature({
                id: Admin.id,
                email: email,
                verified: Admin.verified
            })
        //201 is for created successfully
       return res.status(201).json({
            message: 'Admin created successfully',
            // user
            signature,
            verified: Admin.verified
        })
        }
        
        return res.status(400).json({
            message: 'Admin already exists'
        })
    }
//
    } catch(err){
        res.status(500).json({
            err,
            route: "/admins/signup"
        })
    }
}


export const SuperAdmin = async (req: Request, res: Response) => {
    try{
        const {email, phone, password, firstName, lastName, address} = req.body
        const uuidUser = uuidv4()
        const validateResult = adminSchema.validate(req.body, options)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
//Generate salt
const salt = await GenerateSalt()
const adminPassword = await GeneratePassord(password, salt)

//Generate OTP
const {otp, expiry} = GenerateOTP()
//Check if the admin already exists
//Anytime you are using a schema or model, always await it
const Admin = await UserInstance.findOne(
    {where: {email:email}}) as unknown as UserAttributes

    if(!Admin){
         await UserInstance.create({
            id: uuidUser,
            email,
            password: adminPassword,
            firstName,
            lastName,
            salt,
            address,
            phone,
            otp,
            otp_expiry:expiry,
            lng: 0,
            lat: 0,
            verified: true,
            role: 'superadmin'
        })
            //Check if Admin is created
            //Const user returns an instance of the user that is why we said as unknown as UserAttributes
        const Admin = await UserInstance.findOne({where: {email:email}}) as unknown as UserAttributes
                //Generate signature
              let signature = await GenerateSignature({
                id: Admin.id,
                email: email,
                verified: Admin.verified
            })
        //201 is for created successfully
       return res.status(201).json({
            message: 'Admin created successfully',
            // user
            signature,
            verified: Admin.verified
        })
    }
    return res.status(400).json({
        message: 'Admin already exists'
    })
//
    } catch(err){
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/signup"
        })
    }
}

/// create Vendor
export const createVendor = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.User.id;
        const {name, ownerName, pincode, phone, email, address, password} = req.body;
        const uuidvendor = uuidv4()
        const validateResult = vendorSchema.validate(req.body, options)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        const salt = await GenerateSalt()
        const vendorPassword = await GeneratePassord(password, salt)

        const vendor = await VendorInstance.findOne({where: {email:email}}) as unknown as VendorAttributes;

        const Admin = await UserInstance.findOne({where: {id:id}}) as unknown as UserAttributes;

        if(Admin.role === 'admin'|| Admin.role === 'superadmin') {

            if(!vendor) {
                const createVendor = await VendorInstance.create({
                    id: uuidvendor,
                    password: vendorPassword,
                    name,
                    phone,
                    ownerName,
                    address,
                    email,
                    pincode,
                    salt,
                    role: "vendor",
                    serviceAvailable: false,
                    rating:0,
                })
                return res.status(201).json({
                    message: 'Vendor created successfully',
                    createVendor
                })
            }
            return res.status(400).json({
                message: 'Vendor already exists'
            })
        }

        return res.status(400).json({
            message: 'unauthorized',

        })
    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-vendor"
        })
    }
}



// export const AdminRegister = async(req:JwtPayload, res:Response ) => {
//     try {
//         const id = req.user.id;
//         const { email, password, firstName, lastName, address, phone } = req.body
//         const uuiduser = uuidv4();
//         const validateResult = adminSchema.validate(req.body, options);
//         if (validateResult.error) {
//           return res.status(400).json({
//             Error: validateResult.error.details[0].message
//           })
//         }
        
//         // generate salt
//         const salt = await GenerateSalt();
//         const adminPasword = await GeneratePassord(password, salt);
    
//         //generate otp
//         const { otp, expiry } = GenerateOTP();
    
//         // check if admin exist
//         const Admin = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttributes;

//         if (Admin.email === email) {
//             return res.status(400).json({
//                 Error: "email already exist"
//             })
//         }
        
       
//         if (Admin.role === "superadmin") {
//           let user = await UserInstance.create({
//             id: uuiduser,
//             email,
//             phone,
//             password: adminPasword,
//             firstName,
//             lastName,
//             salt,
//             address,
//             otp,
//             otp_expiry: expiry,
//             lng: 0,
//             lat: 0,
//             verified: true,
//             role: 'admin'
//           }) as unknown as UserAttributes;
        
//         const Admin = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttributes;
//           //Generate Signature
//           let signature = await GenerateSignature({
//             id: Admin.id,
//             email: Admin.email,
//             verified: Admin.verified
//           })
    
    
//           return res.status(201).json({
//             message: 'Admin created successfully',
//             signature,
//             verified: Admin.verified,
    
//           })
//         }
//         return res.status(400).json({
//           message: 'User already exist',
//         })
    
//       } catch (err) {
//         res.status(500).json({
//         //   Error: "Internal Server Error",
//           err,
//           route: "/admin/signup"
//         })
//       }
//     }

    // login

    
  
  