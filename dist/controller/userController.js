"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
//Register user
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
            //Generate Signature
            let signature = await (0, utils_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified
            });
            return res.status(201).json({
                message: 'User created successfully check your email or phone for OTP verification',
                signature,
                verified: User.verified,
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
// Verfiy user
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        // check if user exist
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            const { otp } = req.body;
            if (User.otp === +otp && User.otp_expiry >= new Date()) {
                const updateUser = await userModel_1.UserInstance.update({ verified: true }, { where: { email: decode.email } });
                //GENERATE NEW SIGNATURE
                let signature = await (0, utils_1.GenerateSignature)({
                    id: updateUser.id,
                    email: updateUser.email,
                    verified: updateUser.verified
                });
                if (updateUser) {
                    const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
                    return res.status(200).json({
                        message: 'User verified successfully',
                        signature,
                        verified: User.verified,
                    });
                }
            }
        }
        return res.status(400).json({
            Error: 'Invalid credentials or OTP expired',
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/verify"
        });
    }
};
exports.verifyUser = verifyUser;
// Login user
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.LoginSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (User) {
            const validation = await (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //generate signature
                let signature = await (0, utils_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified
                });
                return res.status(200).json({
                    message: 'User logged in successfully',
                    signature,
                    email: User.email,
                    verified: User.verified,
                });
            }
        }
        return res.status(400).json({
            Error: 'Invalid credentials',
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/login"
        });
    }
};
exports.Login = Login;
// resend otp
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            const { otp, expiry } = (0, utils_1.GenerateOTP)();
            const updateUser = await userModel_1.UserInstance.update({ otp, otp_expiry: expiry }, { where: { email: decode.email } });
            if (updateUser) {
                const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
                await (0, utils_1.onRequestOTP)(otp, User.phone);
                const html = (0, utils_1.emailHtml)(otp);
                await (0, utils_1.Mailsend)(config_1.fromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: 'OTP resent successfully',
                });
            }
        }
        return res.status(400).json({
            Error: "Error resending OTP",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/resend-otp/:signature"
        });
    }
};
exports.resendOTP = resendOTP;
