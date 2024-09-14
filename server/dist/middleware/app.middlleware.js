"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
const authenticationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) ||
            ((_b = req === null || req === void 0 ? void 0 : req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "")) ||
            req.params.token;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "not authentic user",
            });
        }
        let decodedToken = null;
        let user;
        if (process.env.JWT_SECRET_KEY)
            decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (decodedToken && decodedToken.id)
            user = yield user_model_1.User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "error while authentication",
        });
    }
});
exports.authenticationMiddleware = authenticationMiddleware;
