import express, { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { FoodAttributes, FoodInstance } from '../model/foodModel';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';
import { createFoodSchema, GenerateSignature, LoginSchema, options, validatePassword } from '../utils';
import { v4 as uuidv4 } from 'uuid';

// Vendor Lofin
export const vendorLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const validateResult = LoginSchema.validate(req.body, options);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        const Vendor = await VendorInstance.findOne({ where: { email: email } }) as unknown as VendorAttributes;

        if (Vendor) {
            const validation = await validatePassword(password, Vendor.password, Vendor.salt);
            if (validation) {
                //generate signature
                let signature = await GenerateSignature({
                    id: Vendor.id,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvailable
                });
                return res.status(200).json({
                    message: 'User logged in successfully',
                    signature,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvailable,
                    role: Vendor.role
                })
            }
        }
        return res.status(400).json({
            Error: 'Invalid credentials',

        })
    } catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/vendors/login"
        })
    }
}

// Vendor Add Food 

export const createFood = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.vendor.id
        const { name,
            description,
            category,
            foodType,
            readyTime,
            price } = req.body

        const validateResult = createFoodSchema.validate(req.body, options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        const Vendor = await VendorInstance.findOne({ where: { id: id } }) as unknown as VendorAttributes
        const foodid = uuidv4()
        if (Vendor) {
            const Createfood = await FoodInstance.create({
                id: foodid,
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                rating: 0,
                vendorId: id,

            })
            return res.status(200).json({
                message: "Food added successfully",
                Createfood
            })
        }
    } catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/vendors/create-food"
        })
    }
}

// Get Vendor profilr

export const VendorProfile = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.vendor.id;

        const Vendor = await VendorInstance.findOne({
            where: { id: id },
            // attributes: ["id", "name", "email", "phone", "address", "serviceAvailable", "role"],
            include: [{
                model: FoodInstance,
                as: 'food',
                attributes: ['id', 'name', 'description', 'category', 'foodType', 'readyTime', 'price', 'rating', 'vendorId']
            }]
        }) as unknown as VendorAttributes

        return res.status(200).json({
            Vendor
        })
    } catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/vendors/get-profile"
        })
    }
}

// Vendor Delete Food

export const deleteFood = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.vendor.id;

        const foodid = req.params.foodid;

        const Vendor = await VendorInstance.findOne({ where: { id: id } }) as unknown as VendorAttributes

        if (Vendor) {

            // FoodAttributes
            const deletedFood = await FoodInstance.destroy({ where: { id: foodid}})

            return res.status(200).json({
                message: "Food deleted successfully",
            })
        }
    } catch(err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/vendors/delete-food"
        })
    }
}

