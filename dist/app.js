"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Users_1 = __importDefault(require("./routes/Users"));
const index_1 = __importDefault(require("./routes/index"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const Vendor_1 = __importDefault(require("./routes/Vendor"));
const index_2 = require("./config/index");
index_2.db.sync().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.log(err);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
//Router middleware
app.use('/users', Users_1.default);
app.use("/", index_1.default);
app.use('/admin', Admin_1.default);
app.use('/vendors', Vendor_1.default);
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
