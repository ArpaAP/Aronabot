"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ClubSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    belong: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
}, { collection: 'clubs' });
const ClubModel = (0, mongoose_1.model)('Club', exports.ClubSchema);
exports.default = ClubModel;
