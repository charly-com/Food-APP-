import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize('app', '', '',{
    storage: './food.sqlite',
    dialect: 'sqlite',
    logging: false
})

export const AccountSID = process.env.AccountSID;
export const AuthToken = process.env.AuthToken;
export const fromAdminPhone = process.env.fromAdminPhone;

export const Gmail = process.env.Gmail;
export const GmailPass = process.env.GmailPass;
export const fromAdminMail = process.env.fromAdminMail as string;
export const userSubject = process.env.userSubject as string;
export const APP_SECRET = process.env.APP_SECRET as string;