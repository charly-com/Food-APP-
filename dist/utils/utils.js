"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFoodSchema = exports.vendorSchema = exports.adminSchema = exports.updateSchema = exports.validatePassword = exports.LoginSchema = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassord = exports.GenerateSalt = exports.options = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password'))
        .required()
        .label('confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassord = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassord = GeneratePassord;
const GenerateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '1d' });
};
exports.GenerateSignature = GenerateSignature;
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, config_1.APP_SECRET);
};
exports.verifySignature = verifySignature;
exports.LoginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return await (0, exports.GeneratePassord)(enteredPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
exports.updateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
});
exports.adminSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
exports.vendorSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    name: joi_1.default.string().required(),
    ownerName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    pincode: joi_1.default.string().required(),
});
exports.createFoodSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    foodType: joi_1.default.string().required(),
    readyTime: joi_1.default.number().required(),
    price: joi_1.default.number().required(),
});
