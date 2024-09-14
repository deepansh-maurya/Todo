"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbconnect_1 = require("./database/dbconnect");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
(0, dbconnect_1.mongoDbConnect)()
    .then(() => {
    app.listen(8080, () => {
        console.log("server is running");
    });
})
    .catch(() => {
    console.log("server error");
});
const app_routes_1 = __importDefault(require("./routes/app.routes"));
app.use("/api/v1", app_routes_1.default);
