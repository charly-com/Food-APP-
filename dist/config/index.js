"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.userSubject = exports.fromAdminMail = exports.GmailPass = exports.Gmail = exports.fromAdminPhone = exports.AuthToken = exports.AccountSID = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = new sequelize_1.Sequelize('app', '', '', {
    storage: './food.sqlite',
    dialect: 'sqlite',
    logging: false
});
exports.AccountSID = process.env.AccountSID;
exports.AuthToken = process.env.AuthToken;
exports.fromAdminPhone = process.env.fromAdminPhone;
exports.Gmail = process.env.Gmail;
exports.GmailPass = process.env.GmailPass;
exports.fromAdminMail = process.env.fromAdminMail;
exports.userSubject = process.env.userSubject;
exports.APP_SECRET = process.env.APP_SECRET;
