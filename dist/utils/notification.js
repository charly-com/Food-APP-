"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.Mailsend = exports.onRequestOTP = exports.GenerateOTP = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require('twilio')(config_1.AccountSID, config_1.AuthToken);
    const response = client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
const transport = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.Gmail,
        pass: config_1.GmailPass,
    },
    tls: {
        rejectUnauthorized: false
    }
});
// export const sendEmail = () => {
// }
const Mailsend = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.fromAdminMail, to, subject: config_1.userSubject, html
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.Mailsend = Mailsend;
const emailHtml = (otp) => {
    let response = `
    <div style="max-width:700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%">
    <h2 style="text-align:center; text-transform:uppercase; color:teal">Welcome to Charlie Pizza</h2>
    <p> Hi there, your otp is ${otp}</p>
    </div>
    `;
    return response;
};
exports.emailHtml = emailHtml;
