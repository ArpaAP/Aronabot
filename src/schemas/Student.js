"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.StudentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.StudentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    belong: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    club: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Club'
    },
    grade: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    birth: {
        type: String,
        required: true
    },
    hobby: {
        type: String
    },
    illustrator: {
        type: String
    },
    voiceActor: {
        type: String
    }
}, { collection: 'students' });
exports.StudentModel = (0, mongoose_1.model)('Student', exports.StudentSchema);
exports.default = exports.StudentModel;
