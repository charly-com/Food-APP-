"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const utils_1 = require("../utils/utils");
const Register = async (req, res) => {
    try {
        const { email, password, confirm_password, phone } = req.body;
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        // generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const userPasword = await (0, utils_1.GeneratePassord)(password, salt);
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/signup"
        });
    }
};
exports.Register = Register;
