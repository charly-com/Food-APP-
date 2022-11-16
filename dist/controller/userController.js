"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
const Register = async (req, res) => {
    try {
        const { email, password, confirm_password, phone } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        // generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const userPasword = await (0, utils_1.GeneratePassord)(password, salt);
        //generate otp
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // check if user exist
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        //Create User
        if (!User) {
            let user = await userModel_1.UserInstance.create({
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
            });
            // send otp
            await (0, utils_1.onRequestOTP)(otp, phone);
            // send email
            const html = (0, utils_1.emailHtml)(otp);
            await (0, utils_1.Mailsend)(config_1.fromAdminMail, email, config_1.userSubject, html);
            // check if user is created
            const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
            //Generate Token
            let signature = await (0, utils_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified
            });
            return res.status(201).json({
                message: 'User created successfully',
                signature
            });
        }
        return res.status(400).json({
            message: 'User already exist',
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/signup"
        });
    }
};
exports.Register = Register;
