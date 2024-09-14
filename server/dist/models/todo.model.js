"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    due_date: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
    },
    status: {
        type: String,
    },
}, { timestamps: true });
exports.Todo = (0, mongoose_2.model)("Todo", todoSchema);
